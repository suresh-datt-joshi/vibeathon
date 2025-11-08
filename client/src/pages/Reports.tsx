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

export default function Reports() {
  const { data: summary, isLoading } = useQuery<ReportsSummary>({
    queryKey: ["/api/reports/summary"],
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
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">E-commerce Platform</p>
                        <p className="text-xs text-muted-foreground">ECOM</p>
                      </div>
                      <Badge variant="outline" className="bg-[hsl(var(--lozenge-in-progress-bg))] text-[hsl(var(--lozenge-in-progress))] border-[hsl(var(--lozenge-in-progress))]">
                        In Progress
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Mobile App Redesign</p>
                        <p className="text-xs text-muted-foreground">MOBI</p>
                      </div>
                      <Badge variant="outline" className="bg-[hsl(var(--lozenge-todo-bg))] text-[hsl(var(--lozenge-todo))] border-[hsl(var(--lozenge-todo))]">
                        Planning
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Analytics Dashboard</p>
                        <p className="text-xs text-muted-foreground">DASH</p>
                      </div>
                      <Badge variant="outline" className="bg-[hsl(var(--lozenge-done-bg))] text-[hsl(var(--lozenge-done))] border-[hsl(var(--lozenge-done))]">
                        Completed
                      </Badge>
                    </div>
                  </div>
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
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                          JD
                        </div>
                        <div>
                          <p className="text-sm font-medium">John Doe</p>
                          <p className="text-xs text-muted-foreground">87 tasks</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">92%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="velocity" className="space-y-4">
              <Card data-testid="card-sprint-velocity">
                <CardHeader>
                  <CardTitle>Sprint Velocity</CardTitle>
                  <CardDescription>
                    Story points completed per sprint
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    Velocity chart will be displayed here
                  </div>
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
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Total Generations</p>
                        <p className="text-xs text-muted-foreground">This month</p>
                      </div>
                      <div className="text-2xl font-bold">34</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Tasks Generated</p>
                        <p className="text-xs text-muted-foreground">AI-created</p>
                      </div>
                      <div className="text-2xl font-bold">428</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Time Saved</p>
                        <p className="text-xs text-muted-foreground">Estimated hours</p>
                      </div>
                      <div className="text-2xl font-bold">52</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </PageContainer>
    </div>
  );
}
