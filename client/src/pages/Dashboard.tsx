import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, formatDistanceToNow } from "date-fns";
import PageContainer from "@/components/PageContainer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Calendar,
  ClipboardList,
  Flame,
  Gauge,
  Rocket,
  Sparkles,
  Users,
} from "lucide-react";

interface DashboardOverview {
  totalProjects: number;
  totalTasks: number;
  completedTasks: number;
  activeTasks: number;
  blockedTasks: number;
  completionRate: number;
  activeProjects: number;
}

interface SpotlightModule {
  id: string;
  name: string;
  layer: string;
}

interface DashboardSpotlight {
  id: string;
  key: string;
  name: string;
  status: string;
  progress: number;
  summary: string | null;
  modules: SpotlightModule[];
  nextMilestone: string | null;
  updatedAt: string;
}

interface WorkloadBreakdown {
  totalStoryPoints: number;
  activeStoryPoints: number;
  capacityStoryPoints: number;
  utilization: number;
  statusBreakdown: Record<
    string,
    { count: number; storyPoints: number }
  >;
}

interface UpcomingDeadline {
  id: string;
  title: string;
  projectId: string;
  status: string;
  storyPoints: number;
  dueDate: string;
  priority: string;
}

interface ActivityItem {
  type: "project" | "task";
  id: string;
  title: string;
  status: string;
  timestamp: string;
  description: string;
  projectId?: string;
}

interface DashboardResponse {
  overview: DashboardOverview;
  spotlight: DashboardSpotlight | null;
  workload: WorkloadBreakdown;
  upcomingDeadlines: UpcomingDeadline[];
  insights: string[];
  activityFeed: ActivityItem[];
}

function useDashboardData() {
  return useQuery<DashboardResponse>({
    queryKey: ["/api/dashboard"],
    refetchInterval: 15000,
    refetchIntervalInBackground: true,
  });
}

function OverviewSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-6 rounded-full" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-28" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const { data, isLoading, isError, refetch, isFetching } =
    useDashboardData();

  const overviewCards = useMemo(() => {
    if (!data) {
      return [];
    }

    return [
      {
        title: "Total Projects",
        value: data.overview.totalProjects,
        helpText: `${data.overview.activeProjects} active right now`,
        icon: Rocket,
      },
      {
        title: "Active Tasks",
        value: data.overview.activeTasks,
        helpText: `${data.overview.blockedTasks} blocked`,
        icon: ClipboardList,
      },
      {
        title: "Completion Rate",
        value: `${data.overview.completionRate}%`,
        helpText: `${data.overview.completedTasks} tasks done`,
        icon: Gauge,
      },
      {
        title: "Total Work Items",
        value: data.overview.totalTasks,
        helpText: "Across all projects",
        icon: BarChart3,
      },
    ];
  }, [data]);

  return (
    <div className="h-full overflow-auto">
      <PageContainer className="py-8 space-y-8">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Real-time pulse of your AI-augmented project portfolio.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              Refresh
            </Button>
          </div>
        </header>

        {isError ? (
          <Card className="border-destructive bg-destructive/5">
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <CardTitle>Unable to load dashboard data</CardTitle>
              </div>
              <Button variant="outline" onClick={() => refetch()}>
                Try again
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                We couldn&apos;t reach the dashboard service. Check your
                connection and try again in a moment.
              </p>
            </CardContent>
          </Card>
        ) : null}

        {isLoading ? (
          <OverviewSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {overviewCards.map((card) => (
              <Card key={card.title}>
                <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {card.title}
                  </CardTitle>
                  <card.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-semibold">
                    {card.value}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {card.helpText}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <Card className="col-span-1 lg:col-span-3">
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div className="space-y-1">
                <CardTitle>Active Project Spotlight</CardTitle>
                <CardDescription>
                  The project driving the highest amount of active work.
                </CardDescription>
              </div>
              <Badge variant="outline" className="gap-1">
                <Flame className="h-3 w-3" />
                Live focus
              </Badge>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-2 w-full rounded-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ) : data?.spotlight ? (
                <div className="space-y-6">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm text-primary font-semibold">
                        {data.spotlight.key}
                      </span>
                      <Badge variant="outline">
                        {data.spotlight.status.replace("_", " ")}
                      </Badge>
                    </div>
                    <h2 className="text-xl font-semibold">
                      {data.spotlight.name}
                    </h2>
                    {data.spotlight.summary ? (
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {data.spotlight.summary}
                      </p>
                    ) : null}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Progress</span>
                      <span>{data.spotlight.progress}%</span>
                    </div>
                    <Progress value={data.spotlight.progress} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {data.spotlight.modules.length > 0 ? (
                      data.spotlight.modules.map((module) => (
                        <div
                          key={module.id}
                          className="rounded-lg border bg-muted/40 px-3 py-2"
                        >
                          <p className="text-xs text-muted-foreground uppercase tracking-wide">
                            {module.layer}
                          </p>
                          <p className="text-sm font-medium">
                            {module.name}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="col-span-full text-sm text-muted-foreground">
                        No modules are currently associated with this project.
                      </p>
                    )}
                  </div>
                  <Separator />
                  <div className="flex flex-col gap-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <Sparkles className="h-4 w-4" />
                        Next milestone
                      </span>
                      <span>
                        {data.spotlight.nextMilestone ?? "To be defined"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <Activity className="h-4 w-4" />
                        Updated
                      </span>
                      <span>
                        {formatDistanceToNow(
                          new Date(data.spotlight.updatedAt),
                          { addSuffix: true },
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>No projects are active yet.</p>
                  <p>Create a project to see real-time progress here.</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle>Workload & Capacity</CardTitle>
              <CardDescription>
                Story points in-flight against assumed capacity.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-3 w-full rounded-full" />
                  <Skeleton className="h-3 w-3/4 rounded-full" />
                  <Skeleton className="h-3 w-4/5 rounded-full" />
                </div>
              ) : data ? (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-semibold">
                        {data.workload.activeStoryPoints}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Active story points
                      </p>
                    </div>
                    <Badge variant="outline" className="gap-1">
                      <Users className="h-3 w-3" />
                      Capacity {data.workload.capacityStoryPoints}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Utilization</span>
                      <span>{data.workload.utilization}%</span>
                    </div>
                    <Progress value={data.workload.utilization} />
                  </div>
                  <Separator />
                  <div className="space-y-3">
                    {Object.entries(data.workload.statusBreakdown).map(
                      ([status, breakdown]) => (
                        <div
                          key={status}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="capitalize text-muted-foreground">
                            {status.replace("_", " ")}
                          </span>
                          <span className="font-medium">
                            {breakdown.storyPoints} pts ·{" "}
                            {breakdown.count} tasks
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No workload details available yet.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <Card className="col-span-1 lg:col-span-3">
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <div>
                <CardTitle>Upcoming Deadlines</CardTitle>
                <CardDescription>
                  Estimated due dates based on current story point load.
                </CardDescription>
              </div>
              <Badge variant="outline" className="gap-1">
                <Calendar className="h-3 w-3" />
                Next 6
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-4 border-b pb-3 last:border-b-0 last:pb-0"
                    >
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                      <Skeleton className="h-5 w-20 rounded-full" />
                    </div>
                  ))}
                </div>
              ) : data && data.upcomingDeadlines.length > 0 ? (
                <ScrollArea className="h-80 pr-4">
                  <div className="space-y-4">
                    {data.upcomingDeadlines.map((deadline) => (
                      <div
                        key={deadline.id}
                        className="flex flex-col gap-2 border-b pb-3 last:border-b-0 last:pb-0"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="space-y-1">
                            <p className="font-medium">{deadline.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(deadline.dueDate), "eee, MMM d")}
                              {" · "}
                              {deadline.storyPoints} pts
                            </p>
                          </div>
                          <Badge variant="outline" className="capitalize">
                            {deadline.priority}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Project {deadline.projectId.slice(0, 6)}…</span>
                          <span className="capitalize">
                            {deadline.status.replace("_", " ")}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No upcoming deadlines detected. Clear skies ahead!
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle>AI Insights</CardTitle>
              <CardDescription>
                Smart callouts from your workspace data.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className="h-12 w-full" />
                ))
              ) : data ? (
                data.insights.map((insight, index) => (
                  <div
                    key={`${insight}-${index}`}
                    className="flex items-start gap-3 rounded-lg border bg-muted/40 p-3 text-sm"
                  >
                    <Sparkles className="mt-0.5 h-4 w-4 text-primary" />
                    <p>{insight}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No AI insights just yet.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                What changed across projects and tasks lately.
              </CardDescription>
            </div>
            <Badge variant="outline" className="gap-1">
              <Activity className="h-3 w-3" />
              Timeline
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 text-sm text-muted-foreground"
                >
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/5" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                </div>
              ))
            ) : data && data.activityFeed.length > 0 ? (
              <ScrollArea className="h-80 pr-4">
                <div className="space-y-4">
                  {data.activityFeed.map((item) => (
                    <div
                      key={`${item.type}-${item.id}`}
                      className="flex items-start gap-3 border-b pb-3 last:border-b-0 last:pb-0"
                    >
                      <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                        {item.type === "project" ? (
                          <Rocket className="h-5 w-5" />
                        ) : (
                          <ClipboardList className="h-5 w-5" />
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-medium">{item.title}</p>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(item.timestamp), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground capitalize">
                          {item.status.replace("_", " ")}
                        </p>
                        <p className="text-sm">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <p className="text-sm text-muted-foreground">
                No recorded activity yet. Once work starts flowing, you&apos;ll
                see a chronological stream here.
              </p>
            )}
          </CardContent>
        </Card>
      </PageContainer>
    </div>
  );
}

