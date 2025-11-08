import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Search, Filter, LayoutGrid, List, Clock, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
  
  const { data: projects = [], isLoading } = useQuery<ProjectWithCounts[]>({
    queryKey: ["/api/projects"],
  });

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
    <div className="max-w-[1800px] mx-auto">
      <div className="border-b border-border bg-card px-6 py-4">
        <Breadcrumbs items={[{ label: "Projects" }]} />
        <div className="flex items-center justify-between mt-3">
          <h1 className="text-2xl font-semibold">Projects</h1>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                className="pl-9"
                data-testid="input-search-projects"
              />
            </div>
            <Button variant="outline" size="icon" data-testid="button-filter">
              <Filter className="h-4 w-4" />
            </Button>
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
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 border border-dashed rounded-lg">
            <p className="text-muted-foreground mb-4">No projects yet. Create your first AI-powered project!</p>
            <Button onClick={() => setLocation("/new")}>Create Project</Button>
          </div>
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => {
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
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {projects.map((project) => {
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
                    <Badge variant="outline" className={`${config.className} text-xs`}>
                      <StatusIcon className="h-2.5 w-2.5 mr-1" />
                      {config.label}
                    </Badge>
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
