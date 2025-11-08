import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Breadcrumbs from "@/components/Breadcrumbs";
import EnhancedKanbanBoard from "@/components/EnhancedKanbanBoard";
import { Share2, Download, Settings, Sparkles, Loader2 } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

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

interface Module {
  id: string;
  projectId: string;
  name: string;
  layer: string;
  description: string | null;
  technologies: string[] | null;
  dependencies: string[] | null;
  createdAt: Date;
}

interface ProjectDetailData {
  project: {
    id: string;
    key: string;
    name: string;
    description: string | null;
    requirements: string;
    status: string;
    architecture: any;
    createdAt: Date;
    updatedAt: Date;
  };
  tasks: Task[];
  modules: Module[];
}

export default function ProjectDetail() {
  const { toast } = useToast();
  const [, params] = useRoute("/project/:id");
  const projectId = params?.id;

  const { data, isLoading, error } = useQuery<ProjectDetailData>({
    queryKey: ["/api/projects", projectId],
    enabled: !!projectId,
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ taskId, updates }: { taskId: string; updates: Partial<Task> }) => {
      const response = await apiRequest("PUT", `/api/projects/${projectId}/tasks/${taskId}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId] });
      toast({
        title: "Success",
        description: "Task updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update task",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Failed to load project</p>
          <Button onClick={() => window.location.href = "/"} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const { project, tasks, modules } = data;
  const completedTasks = tasks.filter(t => t.status === "done").length;

  const handleTaskUpdate = (task: any) => {
    updateTaskMutation.mutate({
      taskId: task.id,
      updates: {
        status: task.status,
        priority: task.priority,
        assignee: task.assignee,
      },
    });
  };

  const groupedModules = modules.reduce((acc, module) => {
    if (!acc[module.layer]) {
      acc[module.layer] = [];
    }
    acc[module.layer].push(module);
    return acc;
  }, {} as Record<string, Module[]>);

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-border bg-card px-6 py-4 flex-shrink-0">
        <Breadcrumbs items={[
          { label: "Projects", href: "/" },
          { label: project.name }
        ]} />
        
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-3">
            <div>
              <div className="text-xs font-mono font-semibold text-primary mb-1">
                {project.key}
              </div>
              <h1 className="text-2xl font-semibold">{project.name}</h1>
            </div>
            <Badge variant="outline" className="bg-[hsl(var(--lozenge-done-bg))] text-[hsl(var(--lozenge-done))] border-[hsl(var(--lozenge-done))]">
              {completedTasks}/{tasks.length} Done
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" data-testid="button-share">
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
            <Button variant="outline" size="sm" data-testid="button-export">
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
            <Button variant="outline" size="icon" data-testid="button-settings">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="board" className="flex-1 flex flex-col min-h-0">
        <div className="border-b border-border px-6 flex-shrink-0">
          <TabsList className="bg-transparent h-auto p-0">
            <TabsTrigger 
              value="board" 
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-3"
              data-testid="tab-board"
            >
              Board
            </TabsTrigger>
            <TabsTrigger 
              value="timeline" 
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-3"
              data-testid="tab-timeline"
            >
              Timeline
            </TabsTrigger>
            <TabsTrigger 
              value="architecture" 
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-3"
              data-testid="tab-architecture"
            >
              Architecture
            </TabsTrigger>
            <TabsTrigger 
              value="export" 
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-3"
              data-testid="tab-export"
            >
              Export
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-auto">
          <TabsContent value="board" className="m-0 p-6 h-full">
            <EnhancedKanbanBoard 
              projectId={project.id} 
              tasks={tasks} 
              onTaskUpdate={handleTaskUpdate}
            />
          </TabsContent>

          <TabsContent value="timeline" className="m-0 p-6">
            <div className="flex items-center justify-center h-64 border border-dashed rounded-lg">
              <p className="text-muted-foreground">Timeline view coming soon</p>
            </div>
          </TabsContent>

          <TabsContent value="architecture" className="m-0 p-6">
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-sm">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="font-medium">AI-Generated Architecture</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {["frontend", "backend", "database"].map((layer) => {
                  const layerModules = groupedModules[layer] || [];
                  return (
                    <div key={layer} className="border rounded-lg p-4 space-y-3">
                      <h3 className="font-semibold text-sm capitalize">{layer}</h3>
                      <div className="space-y-2">
                        {layerModules.length > 0 ? (
                          layerModules.map((module) => (
                            <div key={module.id} className="text-xs p-3 border rounded bg-card">
                              <div className="font-medium mb-1">{module.name}</div>
                              {module.description && (
                                <div className="text-muted-foreground mb-2">{module.description}</div>
                              )}
                              {module.technologies && module.technologies.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {module.technologies.map((tech) => (
                                    <Badge key={tech} variant="secondary" className="text-[10px] px-1 py-0">
                                      {tech}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="text-xs p-2 border rounded bg-muted text-muted-foreground text-center">
                            No modules
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="export" className="m-0 p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">JSON Export</h3>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Download JSON
                </Button>
              </div>
              <pre className="p-4 border rounded-lg bg-muted text-xs overflow-auto max-h-[600px]">
                {JSON.stringify({ project, tasks, modules }, null, 2)}
              </pre>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
