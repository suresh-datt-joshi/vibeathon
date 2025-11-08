import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { GripVertical, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Task {
  id: string;
  title: string;
  type: "epic" | "story" | "subtask";
  status: "backlog" | "todo" | "in_progress" | "review" | "done";
  priority: "low" | "medium" | "high";
  storyPoints?: number;
  assignee?: string;
  aiGenerated?: boolean;
}

interface EnhancedKanbanBoardProps {
  projectId: string;
  tasks: Task[];
}

export default function EnhancedKanbanBoard({ projectId, tasks }: EnhancedKanbanBoardProps) {
  const columns: Array<{ 
    id: Task["status"]; 
    title: string; 
    color: string;
  }> = [
    { id: "backlog", title: "Backlog", color: "text-muted-foreground" },
    { id: "todo", title: "To Do", color: "text-primary" },
    { id: "in_progress", title: "In Progress", color: "text-secondary" },
    { id: "review", title: "Review", color: "text-accent" },
    { id: "done", title: "Done", color: "text-chart-3" },
  ];

  const getColumnTasks = (status: Task["status"]) => 
    tasks.filter((task) => task.status === status);

  const typeColors: Record<Task["type"], string> = {
    epic: "bg-accent/10 text-accent border-accent/30",
    story: "bg-primary/10 text-primary border-primary/30",
    subtask: "bg-secondary/10 text-secondary border-secondary/30",
  };

  const priorityDots: Record<string, string> = {
    low: "bg-muted-foreground",
    medium: "bg-primary",
    high: "bg-destructive",
  };

  return (
    <div className="space-y-4" data-testid={`kanban-board-${projectId}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold">Task Board</h3>
          <Badge variant="outline" className="text-xs">
            {tasks.length} total
          </Badge>
        </div>
        <Button size="sm" data-testid="button-add-task">
          <Plus className="h-3 w-3 mr-1" />
          Add Task
        </Button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
        {columns.map((column) => {
          const columnTasks = getColumnTasks(column.id);
          const totalPoints = columnTasks.reduce((sum, t) => sum + (t.storyPoints || 0), 0);
          
          return (
            <div key={column.id} className="flex-shrink-0 w-[320px]">
              <div className="glass-strong rounded-lg overflow-hidden">
                <div className="p-4 border-b border-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className={`font-semibold text-sm ${column.color}`}>
                      {column.title}
                    </h4>
                    <Badge variant="secondary" className="text-xs">
                      {columnTasks.length}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {totalPoints} story points
                  </div>
                </div>

                <div className="p-3 space-y-3 min-h-[400px] max-h-[600px] overflow-y-auto">
                  {columnTasks.map((task) => (
                    <Card 
                      key={task.id} 
                      className="hover-elevate cursor-move group relative overflow-hidden"
                      data-testid={`task-${task.id}`}
                    >
                      <div className={`absolute top-0 left-0 bottom-0 w-1 ${
                        task.priority === "high" ? "bg-destructive" :
                        task.priority === "medium" ? "bg-primary" :
                        "bg-muted-foreground"
                      }`} />
                      
                      <CardHeader className="p-3 pb-2">
                        <div className="flex items-start gap-2">
                          <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0 space-y-2">
                            <p className="text-sm font-medium leading-snug line-clamp-2">
                              {task.title}
                            </p>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${typeColors[task.type]}`}
                              >
                                {task.type}
                              </Badge>
                              {task.aiGenerated && (
                                <Badge variant="outline" className="text-xs gap-1">
                                  <Sparkles className="h-2.5 w-2.5" />
                                  AI
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="p-3 pt-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {task.assignee && (
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">
                                  {task.assignee.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                            )}
                            <div className={`h-1.5 w-1.5 rounded-full ${priorityDots[task.priority]}`} />
                          </div>
                          {task.storyPoints && (
                            <span className="text-xs font-semibold text-muted-foreground">
                              {task.storyPoints} pts
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
