import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProjectCard from "@/components/ProjectCard";
import { Plus, FolderKanban, CheckCircle, Clock, Sparkles, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  
  const [projects] = useState([
    {
      id: "1",
      name: "E-commerce Platform",
      description: "Full-stack e-commerce platform with cart, checkout, and payment integration",
      status: "completed" as const,
      createdAt: "2 days ago",
      moduleCount: 12,
      taskCount: 48,
      completionRate: 100,
    },
    {
      id: "2",
      name: "Social Media Dashboard",
      description: "Analytics dashboard for social media engagement metrics and insights",
      status: "processing" as const,
      createdAt: "5 hours ago",
      moduleCount: 8,
      taskCount: 32,
      completionRate: 65,
    },
    {
      id: "3",
      name: "Task Management App",
      description: "Collaborative task management with real-time updates and notifications",
      status: "completed" as const,
      createdAt: "1 week ago",
      moduleCount: 6,
      taskCount: 24,
      completionRate: 100,
    },
    {
      id: "4",
      name: "AI Content Generator",
      description: "AI-powered content generation tool for marketing and social media",
      status: "pending" as const,
      createdAt: "30 minutes ago",
      moduleCount: 0,
      taskCount: 0,
      completionRate: 0,
    },
  ]);

  const stats = [
    { 
      label: "Total Projects", 
      value: "12", 
      icon: FolderKanban, 
      trend: "+3 this month",
      gradient: "from-primary/20 to-primary/5",
      iconBg: "bg-primary/10 text-primary"
    },
    { 
      label: "Completed", 
      value: "8", 
      icon: CheckCircle, 
      trend: "66% success rate",
      gradient: "from-chart-3/20 to-chart-3/5",
      iconBg: "bg-chart-3/10 text-chart-3"
    },
    { 
      label: "In Progress", 
      value: "4", 
      icon: Clock, 
      trend: "Active development",
      gradient: "from-secondary/20 to-secondary/5",
      iconBg: "bg-secondary/10 text-secondary"
    },
  ];

  return (
    <div className="space-y-6">
      <div className="glass-strong rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              Dashboard
              <Sparkles className="h-6 w-6 text-primary" />
            </h1>
            <p className="text-muted-foreground mt-1">
              AI-powered project planning and architecture generation
            </p>
          </div>
          <Button 
            className="gap-2" 
            data-testid="button-new-project"
            onClick={() => setLocation("/new")}
          >
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="glass relative overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} -z-10`} />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <div className={`h-9 w-9 rounded-lg ${stat.iconBg} flex items-center justify-center`}>
                  <Icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {stat.trend}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Projects</h2>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              {...project}
              onClick={() => setLocation(`/project/${project.id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
