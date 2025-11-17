import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Activity,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import PageContainer from "@/components/PageContainer";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { format } from "date-fns";

interface ReportsSummary {
  totalProjects: number;
  projectsCreatedLast30Days: number;
  totals: {
    totalTasks: number;
    completedTasks: number;
    completedLast7Days: number;
    activeTasks: number;
    blockedTasks: number;
    aiGeneratedTasks: number;
  };
  distribution: {
    activeProjects: number;
    blockedProjects: number;
  };
}

interface ProjectWithCounts {
  id: string;
  name: string;
  key: string;
  status: string;
  tasks: number;
  completedTasks: number;
  modules: number;
}

interface VelocityData {
  weeklyVelocity: Array<{
    week: string;
    storyPoints: number;
  }>;
  totalStoryPointsCompleted: number;
  averageVelocity: number;
}

interface AIUsageData {
  totalGenerations: number;
  generationsThisMonth: number;
  tasksGenerated: number;
  storyPointsGenerated: number;
  estimatedHoursSaved: number;
}

export default function Reports() {
  const { data: summary, isLoading } = useQuery<ReportsSummary>({
    queryKey: ["/api/reports/summary"],
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
    staleTime: 0,
  });

  const {
    data: projects,
    isLoading: isProjectsLoading,
  } = useQuery<ProjectWithCounts[]>({
    queryKey: ["/api/projects"],
    refetchInterval: 10000,
    refetchIntervalInBackground: true,
  });

  const {
    data: velocityData,
    isLoading: isVelocityLoading,
  } = useQuery<VelocityData>({
    queryKey: ["/api/reports/velocity"],
    refetchInterval: 10000,
    refetchIntervalInBackground: true,
  });

  const {
    data: aiUsageData,
    isLoading: isAIUsageLoading,
  } = useQuery<AIUsageData>({
    queryKey: ["/api/reports/ai-usage"],
    refetchInterval: 10000,
    refetchIntervalInBackground: true,
  });

  const metrics = useMemo(() => {
    if (!summary) {
      return {
        totalProjects: 0,
        projectsDeltaLabel: "",
        completedTasks: 0,
        completedDeltaLabel: "",
        activeTasks: 0,
        activeProjectsLabel: "",
        blockedTasks: 0,
        blockedProjectsLabel: "",
      };
    }

    const projectsDeltaLabel =
      summary.projectsCreatedLast30Days > 0
        ? `+${summary.projectsCreatedLast30Days} in last 30 days`
        : "No new projects this month";

    const completedDeltaLabel =
      summary.totals.completedLast7Days > 0
        ? `+${summary.totals.completedLast7Days} in last 7 days`
        : "No completions in last 7 days";

    const activeProjectsLabel =
      summary.totals.activeTasks > 0
        ? `Across ${summary.distribution.activeProjects} ${summary.distribution.activeProjects === 1 ? "project" : "projects"
        }`
        : "No active work right now";

    const blockedProjectsLabel =
      summary.totals.blockedTasks > 0
        ? `In ${summary.distribution.blockedProjects} ${summary.distribution.blockedProjects === 1
          ? "project"
          : "projects"
        }`
        : "All clear";

    return {
      totalProjects: summary.totalProjects,
      projectsDeltaLabel,
      completedTasks: summary.totals.completedTasks,
      completedDeltaLabel,
      activeTasks: summary.totals.activeTasks,
      activeProjectsLabel,
      blockedTasks: summary.totals.blockedTasks,
      blockedProjectsLabel,
    };
  }, [summary]);

  const teamPerformance = useMemo(() => {
    if (!projects || projects.length === 0) {
      return [];
    }

    return projects.map((project) => {
      const completionRate =
        project.tasks === 0
          ? 0
          : Math.round((project.completedTasks / project.tasks) * 100);

      return {
        id: project.id,
        name: project.name,
        key: project.key,
        tasks: project.tasks,
        completedTasks: project.completedTasks,
        status: project.status,
        completionRate,
      };
    });
  }, [projects]);

  return (
    <div className="h-full overflow-auto">
      <PageContainer className="py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
            <p className="text-muted-foreground mt-2">
              Insights and analytics for your projects
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card data-testid="card-metric-total">
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Projects
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-7 w-12" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-bold">
                      {metrics.totalProjects}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {metrics.projectsDeltaLabel}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card data-testid="card-metric-completed">
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Completed Tasks
                </CardTitle>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-7 w-16" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-bold">
                      {metrics.completedTasks}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {metrics.completedDeltaLabel}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card data-testid="card-metric-in-progress">
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  In Progress
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-7 w-12" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-bold">
                      {metrics.activeTasks}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {metrics.activeProjectsLabel}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card data-testid="card-metric-blocked">
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Blocked
                </CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-7 w-12" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-bold">
                      {metrics.blockedTasks}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {metrics.blockedProjectsLabel}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview" data-testid="tab-overview">
                Overview
              </TabsTrigger>
              <TabsTrigger value="velocity" data-testid="tab-velocity">
                Velocity
              </TabsTrigger>
              <TabsTrigger value="ai-usage" data-testid="tab-ai-usage">
                AI Usage
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card data-testid="card-project-status">
                <CardHeader>
                  <CardTitle>Project Status Overview</CardTitle>
                  <CardDescription>
                    Current status of all active projects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isProjectsLoading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-16" />
                          </div>
                          <Skeleton className="h-5 w-20" />
                        </div>
                      ))}
                    </div>
                  ) : projects && projects.length > 0 ? (
                    <div className="space-y-4">
                      {projects.map((project) => {
                        // Calculate completion status based on task completion, not database status
                        const isComplete =
                          project.tasks > 0 && project.completedTasks === project.tasks;
                        const hasProgress =
                          project.tasks > 0 && project.completedTasks > 0;
                        
                        // Determine status based on actual completion
                        const derivedStatus = isComplete
                          ? "completed"
                          : hasProgress
                          ? "processing"
                          : "planning";

                        const statusBadgeClass = {
                          completed: "bg-[hsl(var(--lozenge-done-bg))] text-[hsl(var(--lozenge-done))] border-[hsl(var(--lozenge-done))]",
                          processing: "bg-[hsl(var(--lozenge-in-progress-bg))] text-[hsl(var(--lozenge-in-progress))] border-[hsl(var(--lozenge-in-progress))]",
                          planning: "bg-[hsl(var(--lozenge-todo-bg))] text-[hsl(var(--lozenge-todo))] border-[hsl(var(--lozenge-todo))]",
                        }[derivedStatus] || "bg-[hsl(var(--lozenge-todo-bg))] text-[hsl(var(--lozenge-todo))] border-[hsl(var(--lozenge-todo))]";

                        const statusLabel = {
                          completed: "Completed",
                          processing: "In Progress",
                          planning: "Planning",
                        }[derivedStatus] || "Planning";

                        return (
                          <div
                            key={project.id}
                            className="flex items-center justify-between"
                          >
                            <div className="space-y-1">
                              <p className="text-sm font-medium">{project.name}</p>
                              <p className="text-xs text-muted-foreground">{project.key}</p>
                            </div>
                            <Badge variant="outline" className={statusBadgeClass}>
                              {statusLabel}
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No projects available yet.
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card data-testid="card-team-performance">
                <CardHeader>
                  <CardTitle>Team Performance</CardTitle>
                  <CardDescription>
                    Task completion by team members
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isProjectsLoading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-32" />
                              <Skeleton className="h-3 w-24" />
                            </div>
                          </div>
                          <Skeleton className="h-5 w-12" />
                        </div>
                      ))}
                    </div>
                  ) : teamPerformance.length > 0 ? (
                    <div className="space-y-4">
                      {teamPerformance.map((item) => {
                        const trendColor =
                          item.completionRate >= 80
                            ? "text-green-600"
                            : item.completionRate >= 50
                            ? "text-amber-500"
                            : "text-destructive";

                        return (
                          <div
                            key={item.id}
                            className="flex items-center justify-between gap-3"
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                                {item.key.slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <p className="text-sm font-medium">{item.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {item.completedTasks}/{item.tasks} tasks complete
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <TrendingUp className={`h-4 w-4 ${trendColor}`} />
                              <span className="text-sm font-medium">
                                {item.completionRate}%
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No project performance data available yet.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="velocity" className="space-y-4">
              <Card data-testid="card-sprint-velocity">
                <CardHeader>
                  <CardTitle>Sprint Velocity</CardTitle>
                  <CardDescription>
                    Story points completed per week
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isVelocityLoading ? (
                    <div className="h-64 flex items-center justify-center">
                      <Skeleton className="h-full w-full" />
                    </div>
                  ) : velocityData && velocityData.weeklyVelocity.length > 0 ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Total Story Points</p>
                          <p className="text-2xl font-bold">{velocityData.totalStoryPointsCompleted}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Average Velocity</p>
                          <p className="text-2xl font-bold">{velocityData.averageVelocity} pts/week</p>
                        </div>
                      </div>
                      <ChartContainer
                        config={{
                          storyPoints: {
                            label: "Story Points",
                            color: "hsl(var(--chart-1))",
                          },
                        }}
                        className="h-[300px]"
                      >
                        <BarChart data={velocityData.weeklyVelocity.map((item) => ({
                          week: format(new Date(item.week), "MMM dd"),
                          storyPoints: item.storyPoints,
                        }))}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="week"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                          />
                          <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                          />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar
                            dataKey="storyPoints"
                            fill="var(--color-storyPoints)"
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ChartContainer>
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center text-muted-foreground">
                      No velocity data available yet. Complete some tasks to see your velocity.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ai-usage" className="space-y-4">
              <Card data-testid="card-ai-generations">
                <CardHeader>
                  <CardTitle>AI Generations</CardTitle>
                  <CardDescription>
                    AI-powered project planning usage
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isAIUsageLoading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                          <Skeleton className="h-8 w-16" />
                        </div>
                      ))}
                    </div>
                  ) : aiUsageData ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Total Generations</p>
                          <p className="text-xs text-muted-foreground">AI projects created</p>
                        </div>
                        <div className="text-2xl font-bold">{aiUsageData.totalGenerations}</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Generations This Month</p>
                          <p className="text-xs text-muted-foreground">Current month</p>
                        </div>
                        <div className="text-2xl font-bold">{aiUsageData.generationsThisMonth}</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Tasks Generated</p>
                          <p className="text-xs text-muted-foreground">AI-created tasks</p>
                        </div>
                        <div className="text-2xl font-bold">{aiUsageData.tasksGenerated}</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Story Points Generated</p>
                          <p className="text-xs text-muted-foreground">Total story points</p>
                        </div>
                        <div className="text-2xl font-bold">{aiUsageData.storyPointsGenerated}</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Time Saved</p>
                          <p className="text-xs text-muted-foreground">Estimated hours</p>
                        </div>
                        <div className="text-2xl font-bold">{aiUsageData.estimatedHoursSaved}</div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No AI usage data available yet.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </PageContainer>
    </div>
  );
}
