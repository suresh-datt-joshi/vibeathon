import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Rocket,
  Flag,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { format, addDays, addWeeks, startOfWeek, differenceInDays, isAfter, isBefore, eachWeekOfInterval, startOfDay } from "date-fns";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  projectId: string;
  key: string;
  title: string;
  description: string | null;
  type: string;
  status: string;
  priority: string;
  storyPoints: number | null;
  assignee: string | null;
  reporter: string;
  labels: string[] | null;
  aiGenerated: number;
  createdAt: Date;
  updatedAt: Date;
}

interface TimelineViewProps {
  projectId: string;
  tasks: Task[];
  projectStartDate?: Date;
}

interface Sprint {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  tasks: Task[];
  totalStoryPoints: number;
  completedStoryPoints: number;
  status: "planned" | "active" | "completed";
}

interface Milestone {
  id: string;
  name: string;
  date: Date;
  type: "release" | "milestone";
  tasks: Task[];
}

const SPRINT_DURATION_DAYS = 14; // 2 weeks
const STORY_POINTS_PER_SPRINT = 20; // Average velocity

export default function TimelineView({
  projectId,
  tasks,
  projectStartDate,
}: TimelineViewProps) {
  const [zoomLevel, setZoomLevel] = useState(3);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Calculate project timeline
  const timelineData = useMemo(() => {
    if (tasks.length === 0) return null;

    const startDate = projectStartDate || new Date(Math.min(...tasks.map(t => new Date(t.createdAt).getTime())));
    const today = new Date();
    
    // Group tasks into sprints
    const sprints: Sprint[] = [];
    const remainingTasks = [...tasks].sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    let currentSprintStart = startOfWeek(startDate, { weekStartsOn: 1 });
    let sprintIndex = 1;

    while (remainingTasks.length > 0) {
      const sprintTasks: Task[] = [];
      let sprintStoryPoints = 0;
      const sprintEnd = addDays(currentSprintStart, SPRINT_DURATION_DAYS - 1);

      // Assign tasks to sprint based on story points
      for (let i = remainingTasks.length - 1; i >= 0; i--) {
        const task = remainingTasks[i];
        const taskPoints = task.storyPoints || 3; // Default to 3 if no story points
        
        if (sprintStoryPoints + taskPoints <= STORY_POINTS_PER_SPRINT) {
          sprintTasks.push(task);
          sprintStoryPoints += taskPoints;
          remainingTasks.splice(i, 1);
        }
      }

      // If no tasks fit, take at least one
      if (sprintTasks.length === 0 && remainingTasks.length > 0) {
        sprintTasks.push(remainingTasks.shift()!);
        sprintStoryPoints = sprintTasks[0].storyPoints || 3;
      }

      const completedPoints = sprintTasks
        .filter(t => t.status === "done")
        .reduce((sum, t) => sum + (t.storyPoints || 0), 0);

      let status: "planned" | "active" | "completed" = "planned";
      if (isBefore(sprintEnd, today)) {
        status = "completed";
      } else if (isBefore(currentSprintStart, today) && isAfter(sprintEnd, today)) {
        status = "active";
      }

      sprints.push({
        id: `sprint-${sprintIndex}`,
        name: `Sprint ${sprintIndex}`,
        startDate: currentSprintStart,
        endDate: sprintEnd,
        tasks: sprintTasks,
        totalStoryPoints: sprintStoryPoints,
        completedStoryPoints: completedPoints,
        status,
      });

      currentSprintStart = addWeeks(currentSprintStart, 2);
      sprintIndex++;
    }

    // Create milestones/releases
    const milestones: Milestone[] = [];
    const releaseSprints = sprints.filter((_, idx) => (idx + 1) % 3 === 0);
    
    releaseSprints.forEach((sprint, idx) => {
      milestones.push({
        id: `release-${idx + 1}`,
        name: `Release ${idx + 1}`,
        date: sprint.endDate,
        type: "release",
        tasks: sprint.tasks.filter(t => t.status === "done"),
      });
    });

    // Calculate timeline bounds
    const allDates = [
      startDate,
      ...sprints.map(s => s.endDate),
      ...milestones.map(m => m.date),
    ];
    const minDate = new Date(Math.min(...allDates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...allDates.map(d => d.getTime())));
    
    // Add buffer
    const timelineStart = startOfDay(addDays(minDate, -7));
    const timelineEnd = startOfDay(addDays(maxDate, 14));

    return {
      sprints,
      milestones,
      timelineStart,
      timelineEnd,
      startDate,
      today,
    };
  }, [tasks, projectStartDate]);

  // Calculate schedule risks
  const risks = useMemo(() => {
    if (!timelineData) return [];

    const riskList: Array<{
      type: "overdue" | "at_risk" | "blocked";
      task: Task;
      message: string;
    }> = [];

    const today = new Date();

    timelineData.sprints.forEach(sprint => {
      if (sprint.status === "active") {
        const daysRemaining = differenceInDays(sprint.endDate, today);
        const completionRate = sprint.completedStoryPoints / sprint.totalStoryPoints;
        const expectedCompletionRate = 1 - (daysRemaining / SPRINT_DURATION_DAYS);

        // Check for overdue tasks
        sprint.tasks.forEach(task => {
          if (task.status !== "done" && isBefore(new Date(task.createdAt), addDays(today, -SPRINT_DURATION_DAYS))) {
            riskList.push({
              type: "overdue",
              task,
              message: `Task ${task.key} has been in progress for over ${SPRINT_DURATION_DAYS} days`,
            });
          }
        });

        // Check for sprint at risk
        if (completionRate < expectedCompletionRate - 0.2 && daysRemaining < SPRINT_DURATION_DAYS / 2) {
          sprint.tasks.filter(t => t.status !== "done").forEach(task => {
            riskList.push({
              type: "at_risk",
              task,
              message: `Sprint ${sprint.name} is behind schedule`,
            });
          });
        }
      }
    });

    return riskList;
  }, [timelineData]);

  if (!timelineData) {
    return (
      <div className="flex items-center justify-center h-64 border border-dashed rounded-lg bg-muted/30">
        <div className="text-center space-y-2">
          <Calendar className="h-8 w-8 text-muted-foreground mx-auto" />
          <p className="text-sm text-muted-foreground">No tasks to display on timeline</p>
        </div>
      </div>
    );
  }

  const { sprints, milestones, timelineStart, timelineEnd, today } = timelineData;
  const totalDays = differenceInDays(timelineEnd, timelineStart);
  
  // Calculate day width based on zoom level
  const baseDayWidth = 4; // Base pixels per day
  const dayWidth = baseDayWidth * zoomLevel;
  const timelineTotalWidth = totalDays * dayWidth;

  // Generate week markers for the date axis
  const weekMarkers = eachWeekOfInterval(
    { start: timelineStart, end: timelineEnd },
    { weekStartsOn: 1 }
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "done":
        return "bg-[hsl(var(--lozenge-done-bg))] text-[hsl(var(--lozenge-done))] border-[hsl(var(--lozenge-done))]";
      case "in_progress":
        return "bg-[hsl(var(--lozenge-in-progress-bg))] text-[hsl(var(--lozenge-in-progress))] border-[hsl(var(--lozenge-in-progress))]";
      case "review":
        return "bg-[hsl(var(--lozenge-in-progress-bg))] text-[hsl(var(--lozenge-in-progress))] border-[hsl(var(--lozenge-in-progress))]";
      case "todo":
        return "bg-[hsl(var(--lozenge-todo-bg))] text-[hsl(var(--lozenge-todo))] border-[hsl(var(--lozenge-todo))]";
      default:
        return "bg-[hsl(var(--lozenge-low-bg))] text-[hsl(var(--lozenge-low))] border-[hsl(var(--lozenge-low))]";
    }
  };

  const getSprintStatusColor = (status: "planned" | "active" | "completed") => {
    switch (status) {
      case "active":
        return "bg-blue-50 border-blue-300 dark:bg-blue-950/20 dark:border-blue-800";
      case "completed":
        return "bg-green-50 border-green-300 dark:bg-green-950/20 dark:border-green-800";
      default:
        return "bg-gray-50 border-gray-300 dark:bg-gray-800 dark:border-gray-700";
    }
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(3, prev + 0.25));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(0.5, prev - 0.25));
  };

  return (
    <div className="space-y-6">
      {/* Risk Alerts */}
      {risks.length > 0 && (
        <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              <CardTitle className="text-sm font-semibold text-orange-900 dark:text-orange-100">
                Schedule Risks Detected
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {risks.slice(0, 5).map((risk, idx) => (
                <div key={idx} className="text-sm text-orange-800 dark:text-orange-200">
                  <span className="font-medium">{risk.task.key}:</span> {risk.message}
                </div>
              ))}
              {risks.length > 5 && (
                <div className="text-xs text-orange-700 dark:text-orange-300">
                  +{risks.length - 5} more risks
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timeline Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomOut}
            disabled={zoomLevel <= 0.5}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground min-w-[80px] text-center font-medium">
            {Math.round(zoomLevel * 100)}%
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomIn}
            disabled={zoomLevel >= 3}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <div className="ml-4 h-6 w-px bg-border" />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoomLevel(1)}
          >
            Reset
          </Button>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>
            {format(timelineStart, "MMM d")} - {format(timelineEnd, "MMM d, yyyy")}
          </span>
        </div>
      </div>

      {/* Timeline Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Project Timeline</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div 
            className="overflow-x-auto overflow-y-auto"
            style={{ 
              maxHeight: "600px",
              scrollBehavior: "smooth",
              WebkitOverflowScrolling: "touch"
            }}
          >
            <div className="relative p-6" style={{ width: `${Math.max(timelineTotalWidth + 48, 1200)}px`, minHeight: "400px" }}>
              {/* Date Axis */}
              <div className="relative mb-4 border-b border-border pb-2" style={{ width: `${timelineTotalWidth}px`, height: "40px" }}>
                {weekMarkers.map((week, idx) => {
                  const daysFromStart = differenceInDays(week, timelineStart);
                  const leftPosition = daysFromStart * dayWidth;
                  
                  return (
                    <div
                      key={idx}
                      className="absolute top-0 bottom-0 w-px bg-border"
                      style={{ left: `${leftPosition}px` }}
                    >
                      <div className="absolute -top-6 left-0 transform -translate-x-1/2 text-xs text-muted-foreground whitespace-nowrap">
                        {format(week, "MMM d")}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Today indicator */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-primary z-20 pointer-events-none"
                style={{
                  left: `${differenceInDays(today, timelineStart) * dayWidth + 24}px`,
                }}
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded shadow-sm whitespace-nowrap font-medium">
                  Today
                </div>
              </div>

              {/* Sprints */}
              <div className="space-y-6 relative" style={{ width: `${timelineTotalWidth}px` }}>
                {sprints.map((sprint, sprintIdx) => {
                  const sprintStartDays = differenceInDays(sprint.startDate, timelineStart);
                  const sprintDuration = differenceInDays(sprint.endDate, sprint.startDate) + 1;
                  const sprintLeft = sprintStartDays * dayWidth;
                  const sprintWidth = sprintDuration * dayWidth;

                  return (
                    <div key={sprint.id} className="relative">
                      <div className="flex items-start gap-4">
                        {/* Sprint Label */}
                        <div className="w-40 flex-shrink-0 pt-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Rocket className={cn(
                              "h-4 w-4 flex-shrink-0",
                              sprint.status === "active" && "text-blue-600 dark:text-blue-400",
                              sprint.status === "completed" && "text-green-600 dark:text-green-400",
                              sprint.status === "planned" && "text-muted-foreground"
                            )} />
                            <span className="font-semibold text-sm">{sprint.name}</span>
                          </div>
                          <div className="text-xs text-muted-foreground ml-6">
                            {sprint.completedStoryPoints}/{sprint.totalStoryPoints} pts
                          </div>
                          <div className="text-xs text-muted-foreground ml-6 mt-0.5">
                            {sprint.tasks.length} {sprint.tasks.length === 1 ? "task" : "tasks"}
                          </div>
                        </div>

                        {/* Sprint Timeline */}
                        <div className="relative min-h-[120px] flex-shrink-0" style={{ width: `${timelineTotalWidth}px` }}>
                          {/* Sprint bar background */}
                          <div
                            className={cn(
                              "absolute top-0 h-12 rounded-md border-2 transition-colors",
                              getSprintStatusColor(sprint.status)
                            )}
                            style={{
                              left: `${sprintLeft}px`,
                              width: `${sprintWidth}px`,
                            }}
                          >
                            {/* Sprint dates */}
                            <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-foreground/70 px-2">
                              <span className="truncate">
                                {format(sprint.startDate, "MMM d")} - {format(sprint.endDate, "MMM d")}
                              </span>
                            </div>
                            
                            {/* Progress bar */}
                            {sprint.status === "active" && sprint.totalStoryPoints > 0 && (
                              <div
                                className="absolute bottom-0 left-0 h-1 bg-green-500 rounded-b-md transition-all"
                                style={{
                                  width: `${(sprint.completedStoryPoints / sprint.totalStoryPoints) * 100}%`,
                                }}
                              />
                            )}
                          </div>

                          {/* Tasks */}
                          <div className="absolute top-14 space-y-2" style={{ left: `${sprintLeft}px`, width: `${sprintWidth}px` }}>
                            {sprint.tasks.map((task, taskIdx) => {
                              const taskStartDays = differenceInDays(new Date(task.createdAt), timelineStart);
                              const taskLeft = (taskStartDays - sprintStartDays) * dayWidth;
                              const taskPoints = task.storyPoints || 3;
                              const taskWidth = Math.max(
                                60,
                                (taskPoints / sprint.totalStoryPoints) * sprintWidth * 0.95
                              );

                              return (
                                <Tooltip key={task.id}>
                                  <TooltipTrigger asChild>
                                    <div
                                      className={cn(
                                        "relative h-8 rounded border-l-4 cursor-pointer hover:shadow-md transition-all group",
                                        getStatusColor(task.status),
                                        task.status === "done" && "opacity-75"
                                      )}
                                      style={{
                                        left: `${Math.max(0, taskLeft)}px`,
                                        width: `${Math.min(taskWidth, sprintWidth - Math.max(0, taskLeft))}px`,
                                      }}
                                    >
                                      <div className="absolute inset-0 flex items-center px-2 gap-2">
                                        <span className="text-xs font-semibold truncate flex-shrink-0">
                                          {task.key}
                                        </span>
                                        <span className="text-xs truncate flex-1 min-w-0">
                                          {task.title}
                                        </span>
                                        {task.storyPoints && (
                                          <Badge variant="secondary" className="h-4 px-1 text-[10px] flex-shrink-0">
                                            {task.storyPoints}
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent side="top" className="max-w-xs">
                                    <div className="space-y-1">
                                      <div className="font-semibold">{task.key}: {task.title}</div>
                                      <div className="text-xs space-y-0.5">
                                        <div>Status: <span className="capitalize">{task.status.replace("_", " ")}</span></div>
                                        <div>Story Points: {task.storyPoints || "N/A"}</div>
                                        <div>Priority: <span className="capitalize">{task.priority}</span></div>
                                        {task.assignee && <div>Assignee: {task.assignee}</div>}
                                      </div>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Milestones */}
                {milestones.length > 0 && (
                  <div className="mt-12 pt-6 border-t border-border">
                    <h3 className="text-sm font-semibold mb-6 flex items-center gap-2 text-foreground">
                      <Flag className="h-4 w-4" />
                      Releases & Milestones
                    </h3>
                    <div className="space-y-4 relative" style={{ width: `${timelineTotalWidth}px` }}>
                      {milestones.map((milestone) => {
                        const milestoneDays = differenceInDays(milestone.date, timelineStart);
                        const milestoneLeft = milestoneDays * dayWidth;

                        return (
                          <div key={milestone.id} className="relative" style={{ left: `${milestoneLeft}px` }}>
                            <div className="absolute top-0 bottom-0 w-0.5 bg-purple-500 dark:bg-purple-400">
                              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                                <div className="bg-purple-500 dark:bg-purple-600 text-white text-xs px-3 py-1.5 rounded-md shadow-sm whitespace-nowrap font-semibold">
                                  {milestone.name}
                                </div>
                              </div>
                            </div>
                            <div className="absolute top-8 left-0 mt-2 text-xs text-muted-foreground whitespace-nowrap">
                              {format(milestone.date, "MMM d, yyyy")}
                              {milestone.tasks.length > 0 && (
                                <span className="ml-2 text-purple-600 dark:text-purple-400 font-medium">
                                  ({milestone.tasks.length} {milestone.tasks.length === 1 ? "task" : "tasks"} completed)
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sprint Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sprints.slice(0, 3).map((sprint) => (
          <Card key={sprint.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Rocket className={cn(
                  "h-4 w-4",
                  sprint.status === "active" && "text-blue-600 dark:text-blue-400",
                  sprint.status === "completed" && "text-green-600 dark:text-green-400"
                )} />
                <CardTitle className="text-sm font-semibold">{sprint.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-semibold">
                  {Math.round((sprint.completedStoryPoints / sprint.totalStoryPoints) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div
                  className={cn(
                    "h-2.5 rounded-full transition-all",
                    sprint.status === "completed" && "bg-green-500",
                    sprint.status === "active" && "bg-blue-500",
                    sprint.status === "planned" && "bg-gray-400"
                  )}
                  style={{
                    width: `${(sprint.completedStoryPoints / sprint.totalStoryPoints) * 100}%`,
                  }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{sprint.tasks.length} {sprint.tasks.length === 1 ? "task" : "tasks"}</span>
                <span className="font-medium">{sprint.completedStoryPoints}/{sprint.totalStoryPoints} pts</span>
              </div>
              <div className="flex items-center gap-2 text-xs pt-1">
                {sprint.status === "active" && (
                  <>
                    <Clock className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                    <span className="text-blue-600 dark:text-blue-400 font-medium">Active</span>
                  </>
                )}
                {sprint.status === "completed" && (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                    <span className="text-green-600 dark:text-green-400 font-medium">Completed</span>
                  </>
                )}
                {sprint.status === "planned" && (
                  <>
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground font-medium">Planned</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
