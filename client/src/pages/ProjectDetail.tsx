import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ArchitectureDiagram from "@/components/ArchitectureDiagram";
import KanbanBoard from "@/components/KanbanBoard";
import JsonViewer from "@/components/JsonViewer";
import AIProcessingIndicator from "@/components/AIProcessingIndicator";
import { Download, Share2, Edit } from "lucide-react";
import { useState } from "react";

export default function ProjectDetail() {
  const [project] = useState({
    name: "E-commerce Platform",
    description: "Full-stack e-commerce platform with shopping cart, checkout, and payment integration",
    status: "completed" as const,
    requirements: "Build an e-commerce platform where users can browse products, add items to cart, checkout, and make payments. Include admin dashboard for managing products and orders.",
  });

  const [modules] = useState([
    { id: "1", name: "React SPA", type: "frontend" as const, description: "Main user interface with product catalog and cart" },
    { id: "2", name: "Product Service", type: "backend" as const, description: "REST API for product management" },
    { id: "3", name: "Cart Service", type: "backend" as const, description: "Shopping cart and checkout logic" },
    { id: "4", name: "Payment Service", type: "backend" as const, description: "Payment processing integration" },
    { id: "5", name: "PostgreSQL", type: "database" as const, description: "Main database for products and orders" },
    { id: "6", name: "Redis Cache", type: "database" as const, description: "Caching layer for performance" },
  ]);

  const [tasks] = useState([
    { id: "1", title: "Set up project structure", type: "story" as const, status: "done" as const, priority: "high" as const, storyPoints: 3 },
    { id: "2", title: "Design database schema", type: "story" as const, status: "done" as const, priority: "high" as const, storyPoints: 5 },
    { id: "3", title: "Implement product catalog", type: "epic" as const, status: "in_progress" as const, priority: "high" as const, storyPoints: 13 },
    { id: "4", title: "Build shopping cart", type: "story" as const, status: "in_progress" as const, priority: "high" as const, storyPoints: 8 },
    { id: "5", title: "Create checkout flow", type: "story" as const, status: "todo" as const, priority: "medium" as const, storyPoints: 8 },
    { id: "6", title: "Integrate payment gateway", type: "epic" as const, status: "todo" as const, priority: "high" as const, storyPoints: 13 },
    { id: "7", title: "Add product search", type: "subtask" as const, status: "review" as const, priority: "medium" as const, storyPoints: 5 },
  ]);

  const jsonData = {
    project: {
      name: project.name,
      description: project.description,
      architecture: {
        modules: modules.map(m => ({ name: m.name, type: m.type, description: m.description })),
      },
      tasks: tasks.map(t => ({ id: t.id, title: t.title, type: t.type, status: t.status, priority: t.priority })),
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <Badge variant="outline" className="bg-secondary text-secondary-foreground">
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
          <Button data-testid="button-export">
            <Download className="h-4 w-4 mr-2" />
            Export JSON
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
          <TabsTrigger value="architecture" data-testid="tab-architecture">Architecture</TabsTrigger>
          <TabsTrigger value="tasks" data-testid="tab-tasks">Tasks</TabsTrigger>
          <TabsTrigger value="export" data-testid="tab-export">Export</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
              <CardDescription>Original project requirements provided for AI analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{project.requirements}</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Architecture Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Modules:</span>
                    <span className="font-medium">{modules.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Frontend Components:</span>
                    <span className="font-medium">{modules.filter(m => m.type === "frontend").length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Backend Services:</span>
                    <span className="font-medium">{modules.filter(m => m.type === "backend").length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Data Stores:</span>
                    <span className="font-medium">{modules.filter(m => m.type === "database").length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Task Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Tasks:</span>
                    <span className="font-medium">{tasks.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Completed:</span>
                    <span className="font-medium text-secondary">{tasks.filter(t => t.status === "done").length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">In Progress:</span>
                    <span className="font-medium text-primary">{tasks.filter(t => t.status === "in_progress").length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Story Points:</span>
                    <span className="font-medium">{tasks.reduce((sum, t) => sum + (t.storyPoints || 0), 0)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="architecture">
          <ArchitectureDiagram modules={modules} />
        </TabsContent>

        <TabsContent value="tasks">
          <KanbanBoard tasks={tasks} />
        </TabsContent>

        <TabsContent value="export">
          <JsonViewer data={jsonData} title="Complete Project Specification" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
