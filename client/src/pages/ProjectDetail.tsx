import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Breadcrumbs from "@/components/Breadcrumbs";
import EnhancedKanbanBoard from "@/components/EnhancedKanbanBoard";
import { Share2, Download, Settings, Sparkles } from "lucide-react";
import { useState } from "react";

export default function ProjectDetail() {
  const [project] = useState({
    key: "ECOM",
    name: "E-commerce Platform",
    description: "Full-stack e-commerce platform with shopping cart, checkout, and payment integration",
    status: "completed" as const,
  });

  const [tasks] = useState([
    { id: "ECOM-1", title: "Set up project structure and initial configuration", type: "story" as const, status: "done" as const, priority: "high" as const, storyPoints: 3, assignee: "JD", aiGenerated: true },
    { id: "ECOM-2", title: "Design comprehensive database schema for products and orders", type: "story" as const, status: "done" as const, priority: "high" as const, storyPoints: 5, assignee: "SM" },
    { id: "ECOM-3", title: "Implement product catalog with search and filters", type: "epic" as const, status: "in_progress" as const, priority: "high" as const, storyPoints: 13, assignee: "JD", aiGenerated: true },
    { id: "ECOM-4", title: "Build shopping cart with add/remove functionality", type: "story" as const, status: "in_progress" as const, priority: "high" as const, storyPoints: 8, assignee: "AL" },
    { id: "ECOM-5", title: "Create checkout flow with address validation", type: "story" as const, status: "todo" as const, priority: "medium" as const, storyPoints: 8, aiGenerated: true },
    { id: "ECOM-6", title: "Integrate Stripe payment gateway", type: "epic" as const, status: "todo" as const, priority: "high" as const, storyPoints: 13, aiGenerated: true },
    { id: "ECOM-7", title: "Add product search with Elasticsearch", type: "subtask" as const, status: "review" as const, priority: "medium" as const, storyPoints: 5, assignee: "SM" },
    { id: "ECOM-8", title: "Implement admin dashboard analytics", type: "story" as const, status: "backlog" as const, priority: "low" as const, storyPoints: 8 },
    { id: "ECOM-9", title: "Add user authentication and authorization", type: "epic" as const, status: "done" as const, priority: "high" as const, storyPoints: 13, assignee: "JD", aiGenerated: true },
    { id: "ECOM-10", title: "Build order history page", type: "story" as const, status: "todo" as const, priority: "medium" as const, storyPoints: 5, aiGenerated: true },
  ]);

  const completedTasks = tasks.filter(t => t.status === "done").length;

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
            <EnhancedKanbanBoard projectId="1" tasks={tasks} />
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
                {["Frontend", "Backend", "Database"].map((layer) => (
                  <div key={layer} className="border rounded-lg p-4 space-y-3">
                    <h3 className="font-semibold text-sm">{layer}</h3>
                    <div className="space-y-2">
                      <div className="text-xs p-2 border rounded bg-card">
                        <div className="font-medium">Module 1</div>
                        <div className="text-muted-foreground">Description</div>
                      </div>
                      <div className="text-xs p-2 border rounded bg-card">
                        <div className="font-medium">Module 2</div>
                        <div className="text-muted-foreground">Description</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="export" className="m-0 p-6">
            <div className="flex items-center justify-center h-64 border border-dashed rounded-lg">
              <p className="text-muted-foreground">JSON export view</p>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
