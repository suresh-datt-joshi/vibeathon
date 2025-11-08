import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ArchitectureDiagram from "@/components/ArchitectureDiagram";
import EnhancedKanbanBoard from "@/components/EnhancedKanbanBoard";
import JsonViewer from "@/components/JsonViewer";
import { Download, Share2, Edit, Sparkles, Layers, CheckCircle2, Clock } from "lucide-react";
import { useState } from "react";

export default function ProjectDetail() {
  const [project] = useState({
    name: "E-commerce Platform",
    description: "Full-stack e-commerce platform with shopping cart, checkout, and payment integration",
    status: "completed" as const,
    requirements: "Build an e-commerce platform where users can browse products, add items to cart, checkout, and make payments. Include admin dashboard for managing products and orders.",
  });

  const [modules] = useState([
    { id: "1", name: "React SPA", type: "frontend" as const, description: "Product catalog and shopping cart", technologies: ["React", "TypeScript", "Tailwind"] },
    { id: "2", name: "Admin Dashboard", type: "frontend" as const, description: "Product and order management", technologies: ["React", "Recharts"] },
    { id: "3", name: "Product Service", type: "backend" as const, description: "REST API for products", technologies: ["Express", "Node.js"] },
    { id: "4", name: "Cart Service", type: "backend" as const, description: "Shopping cart logic", technologies: ["Express", "Redis"] },
    { id: "5", name: "Payment Service", type: "backend" as const, description: "Payment processing", technologies: ["Stripe", "Express"] },
    { id: "6", name: "PostgreSQL", type: "database" as const, description: "Products and orders data", technologies: ["PostgreSQL", "Drizzle"] },
    { id: "7", name: "Redis", type: "database" as const, description: "Cart caching", technologies: ["Redis"] },
  ]);

  const [tasks] = useState([
    { id: "1", title: "Set up project structure and initial configuration", type: "story" as const, status: "done" as const, priority: "high" as const, storyPoints: 3, assignee: "JD", aiGenerated: true },
    { id: "2", title: "Design comprehensive database schema for products and orders", type: "story" as const, status: "done" as const, priority: "high" as const, storyPoints: 5, assignee: "SM" },
    { id: "3", title: "Implement product catalog with search and filters", type: "epic" as const, status: "in_progress" as const, priority: "high" as const, storyPoints: 13, assignee: "JD", aiGenerated: true },
    { id: "4", title: "Build shopping cart with add/remove functionality", type: "story" as const, status: "in_progress" as const, priority: "high" as const, storyPoints: 8, assignee: "AL" },
    { id: "5", title: "Create checkout flow with address validation", type: "story" as const, status: "todo" as const, priority: "medium" as const, storyPoints: 8, aiGenerated: true },
    { id: "6", title: "Integrate Stripe payment gateway", type: "epic" as const, status: "todo" as const, priority: "high" as const, storyPoints: 13, aiGenerated: true },
    { id: "7", title: "Add product search with Elasticsearch", type: "subtask" as const, status: "review" as const, priority: "medium" as const, storyPoints: 5, assignee: "SM" },
    { id: "8", title: "Implement admin dashboard analytics", type: "story" as const, status: "backlog" as const, priority: "low" as const, storyPoints: 8 },
  ]);

  const jsonData = {
    project: {
      name: project.name,
      description: project.description,
      architecture: {
        modules: modules.map(m => ({ 
          name: m.name, 
          type: m.type, 
          description: m.description,
          technologies: m.technologies 
        })),
      },
      tasks: tasks.map(t => ({ 
        id: t.id, 
        title: t.title, 
        type: t.type, 
        status: t.status, 
        priority: t.priority,
        storyPoints: t.storyPoints,
        assignee: t.assignee
      })),
    },
  };

  const completedTasks = tasks.filter(t => t.status === "done").length;
  const totalStoryPoints = tasks.reduce((sum, t) => sum + (t.storyPoints || 0), 0);
  const completedPoints = tasks.filter(t => t.status === "done").reduce((sum, t) => sum + (t.storyPoints || 0), 0);

  return (
    <div className="space-y-6">
      <div className="glass-strong rounded-lg p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{project.name}</h1>
              <Badge className="bg-chart-3/10 text-chart-3 border-chart-3/30">
                {project.status}
              </Badge>
            </div>
            <p className="text-muted-foreground">{project.description}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" data-testid="button-share">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" data-testid="button-edit">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button className="gap-2" data-testid="button-export">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="glass">
          <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
          <TabsTrigger value="architecture" data-testid="tab-architecture">Architecture</TabsTrigger>
          <TabsTrigger value="tasks" data-testid="tab-tasks">Tasks</TabsTrigger>
          <TabsTrigger value="export" data-testid="tab-export">Export</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card className="glass">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <CardTitle>Requirements</CardTitle>
              </div>
              <CardDescription>Original project requirements analyzed by AI</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{project.requirements}</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="glass relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 -z-10" />
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-primary" />
                  <CardTitle className="text-base">Architecture</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Modules</span>
                  <span className="font-semibold">{modules.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Frontend</span>
                  <span className="font-semibold">{modules.filter(m => m.type === "frontend").length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Backend</span>
                  <span className="font-semibold">{modules.filter(m => m.type === "backend").length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Databases</span>
                  <span className="font-semibold">{modules.filter(m => m.type === "database").length}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="glass relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-secondary/5 -z-10" />
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-secondary" />
                  <CardTitle className="text-base">Progress</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tasks Completed</span>
                    <span className="font-semibold">{completedTasks}/{tasks.length}</span>
                  </div>
                  <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                    <div 
                      className="h-full gradient-aurora transition-all"
                      style={{ width: `${(completedTasks / tasks.length) * 100}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-accent/5 -z-10" />
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-accent" />
                  <CardTitle className="text-base">Story Points</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Completed</span>
                  <span className="font-semibold">{completedPoints}/{totalStoryPoints} pts</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">AI Generated</span>
                  <span className="font-semibold">{tasks.filter(t => t.aiGenerated).length} tasks</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="architecture">
          <ArchitectureDiagram modules={modules} />
        </TabsContent>

        <TabsContent value="tasks">
          <EnhancedKanbanBoard projectId="1" tasks={tasks} />
        </TabsContent>

        <TabsContent value="export">
          <JsonViewer data={jsonData} title="Complete Project Specification" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
