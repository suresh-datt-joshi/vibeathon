import { useCallback, useMemo, useState } from "react";
import { useLocation } from "wouter";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Breadcrumbs from "@/components/Breadcrumbs";
import {
  Search,
  Filter,
  LayoutGrid,
  List,
  Clock,
  CheckCircle,
  AlertCircle,
  Trash2,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ProjectWithCounts {
  id: string;
  key: string;
  name: string;
  description: string | null;
  requirements: string;
  status: string;
  architecture: any;
  createdAt: Date;
  updatedAt: Date;
  tasks: number;
  completedTasks: number;
  modules: number;
}

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: projects = [], isLoading } = useQuery<ProjectWithCounts[]>({
    queryKey: ["/api/projects"],
  });

  const deleteProject = useMutation({
    mutationFn: async (projectId: string) => {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.error || "Failed to delete project");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/reports/summary"] });
      toast({
        title: "Project deleted",
        description: "The project has been removed from your workspace.",
      });
    },
    onError: (error: unknown) => {
      toast({
        title: "Unable to delete project",
        description:
          error instanceof Error
            ? error.message
            : "Please try again in a moment.",
        variant: "destructive",
      });
    },
  });

  const handleDeleteProject = useCallback(
    (projectId: string) => {
      const confirmed = window.confirm(
        "Delete this project? All generated tasks and modules will be removed."
      );

      if (!confirmed) {
        return;
      }

      deleteProject.mutate(projectId);
    },
    [deleteProject]
  );

  const filteredProjects = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      return projects;
    }

    return projects.filter((project) => {
      const fields = [
        project.name,
        project.key,
        project.description ?? "",
        project.requirements ?? "",
      ];

      return fields.some((field) =>
        field.toLowerCase().includes(term)
      );
    });
  }, [projects, searchTerm]);

  const statusConfig = {
    completed: {
      label: "Done",
      icon: CheckCircle,
      className: "bg-[hsl(var(--lozenge-done-bg))] text-[hsl(var(--lozenge-done))] border-[hsl(var(--lozenge-done))]"
    },
    processing: {
      label: "In Progress",
      icon: Clock,
      className: "bg-[hsl(var(--lozenge-in-progress-bg))] text-[hsl(var(--lozenge-in-progress))] border-[hsl(var(--lozenge-in-progress))]"
    },
    pending: {
      label: "To Do",
      icon: AlertCircle,
      className: "bg-[hsl(var(--lozenge-todo-bg))] text-[hsl(var(--lozenge-todo))] border-[hsl(var(--lozenge-todo))]"
    },
  };

  return (
    <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="border-b border-border bg-card py-6 px-6 sm:px-8 rounded-b-lg">
        <div className="flex flex-col gap-4">
          <Breadcrumbs items={[{ label: "Dashboard" }]} />
          <h1 className="text-3xl font-semibold tracking-tight">Projects</h1>
        </div>
      </div>

      <div className="py-8 space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                className="pl-9"
                data-testid="input-search-projects"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Button
                    variant="outline"
                    size="icon"
                    data-testid="button-filter"
                    disabled
                  >
                    <Filter className="h-4 w-4" />
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent sideOffset={6}>
                Advanced filters coming soon
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
              data-testid="button-view-grid"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
              data-testid="button-view-list"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isLoading ? (
          viewMode === "list" ? (
            <ProjectTableSkeleton />
          ) : (
            <ProjectGridSkeleton />
          )
        ) : projects.length === 0 ? (
          <EmptyProjectsState onCreate={() => setLocation("/new")} />
        ) : filteredProjects.length === 0 ? (
          <NoResultsState onReset={() => setSearchTerm("")} />
        ) : viewMode === "list" ? (
          <div className="border rounded-lg bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Key</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Modules</TableHead>
                  <TableHead>Tasks</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Lead</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="w-[60px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.map((project) => {
                  const statusKey = project.status as keyof typeof statusConfig;
                  const config = statusConfig[statusKey] || statusConfig.pending;
                  const StatusIcon = config.icon;
                  const progress = project.tasks > 0 ? Math.round((project.completedTasks / project.tasks) * 100) : 0;

                  return (
                    <TableRow
                      key={project.id}
                      className="cursor-pointer hover-elevate"
                      onClick={() => setLocation(`/project/${project.id}`)}
                      data-testid={`row-project-${project.id}`}
                    >
                      <TableCell className="font-mono font-semibold text-primary">
                        {project.key}
                      </TableCell>
                      <TableCell className="font-medium">{project.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={config.className}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {config.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{project.modules}</TableCell>
                      <TableCell>
                        <span className="text-muted-foreground">
                          {project.completedTasks}/{project.tasks}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground w-10">
                            {progress}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">
                          AI
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          data-testid={`button-delete-project-${project.id}`}
                          onClick={(event) => {
                            event.stopPropagation();
                            handleDeleteProject(project.id);
                          }}
                          disabled={deleteProject.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProjects.map((project) => {
              const statusKey = project.status as keyof typeof statusConfig;
              const config = statusConfig[statusKey] || statusConfig.pending;
              const StatusIcon = config.icon;
              const progress = project.tasks > 0 ? Math.round((project.completedTasks / project.tasks) * 100) : 0;

              return (
                <div
                  key={project.id}
                  onClick={() => setLocation(`/project/${project.id}`)}
                  className="border rounded-lg p-4 bg-card hover-elevate cursor-pointer space-y-3"
                  data-testid={`card-project-${project.id}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-xs font-mono font-semibold text-primary mb-1">
                        {project.key}
                      </div>
                      <h3 className="font-semibold line-clamp-1">{project.name}</h3>
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className={cn(config.className, "text-xs")}>
                        <StatusIcon className="h-2.5 w-2.5 mr-1" />
                        {config.label}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        data-testid={`card-delete-project-${project.id}`}
                        onClick={(event) => {
                          event.stopPropagation();
                          handleDeleteProject(project.id);
                        }}
                        disabled={deleteProject.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{project.completedTasks}/{project.tasks} tasks</span>
                      <span>{project.modules} modules</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t text-xs text-muted-foreground">
                    <span>AI-generated</span>
                    <span>{formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectTableSkeleton() {
  return (
    <div className="border rounded-lg bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">
              <Skeleton className="h-4 w-12" />
            </TableHead>
            <TableHead><Skeleton className="h-4 w-20" /></TableHead>
            <TableHead><Skeleton className="h-4 w-16" /></TableHead>
            <TableHead><Skeleton className="h-4 w-16" /></TableHead>
            <TableHead><Skeleton className="h-4 w-16" /></TableHead>
            <TableHead><Skeleton className="h-4 w-20" /></TableHead>
            <TableHead><Skeleton className="h-4 w-12" /></TableHead>
            <TableHead><Skeleton className="h-4 w-20" /></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(4)].map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <Skeleton className="h-4 w-14" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-32" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-24 rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-12" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-16" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-28" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-6 rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function ProjectGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {[...Array(8)].map((_, index) => (
        <div key={index} className="border rounded-lg p-4 bg-card space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <Skeleton className="h-3 w-16 mb-2" />
              <Skeleton className="h-5 w-36" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-2 w-full rounded-full" />
          </div>
          <div className="flex items-center justify-between pt-2 border-t">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyProjectsState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 border border-dashed rounded-lg text-center space-y-4 bg-muted/30">
      <div>
        <p className="text-lg font-semibold">No projects yet</p>
        <p className="text-sm text-muted-foreground">
          Kick off your first AI-powered project to generate architecture, tasks, and more.
        </p>
      </div>
      <Button onClick={onCreate} data-testid="button-empty-create">
        Create Project
      </Button>
    </div>
  );
}

function NoResultsState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 border border-dashed rounded-lg text-center space-y-3 bg-muted/30">
      <p className="text-lg font-semibold">No matching projects</p>
      <p className="text-sm text-muted-foreground">
        Try adjusting your search or clearing filters to see all projects.
      </p>
      <Button variant="outline" onClick={onReset} data-testid="button-clear-search">
        Clear search
      </Button>
    </div>
  );
}
