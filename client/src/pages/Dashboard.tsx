import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ProjectCard from "@/components/ProjectCard";
import { Plus, FolderKanban, CheckCircle, Clock } from "lucide-react";
import { useState } from "react";

export default function Dashboard() {
  const [projects] = useState([
    {
      id: "1",
      name: "E-commerce Platform",
      description: "Full-stack e-commerce platform with cart, checkout, and payment integration",
      status: "completed" as const,
      createdAt: "2 days ago",
      moduleCount: 12,
      taskCount: 48,
    },
    {
      id: "2",
      name: "Social Media Dashboard",
      description: "Analytics dashboard for social media engagement metrics",
      status: "processing" as const,
      createdAt: "5 hours ago",
      moduleCount: 8,
      taskCount: 32,
    },
    {
      id: "3",
      name: "Task Management App",
      description: "Collaborative task management with real-time updates",
      status: "pending" as const,
      createdAt: "1 week ago",
      moduleCount: 6,
      taskCount: 24,
    },
  ]);

  const stats = [
    { label: "Total Projects", value: "12", icon: FolderKanban, color: "text-primary" },
    { label: "Completed", value: "8", icon: CheckCircle, color: "text-secondary" },
    { label: "In Progress", value: "4", icon: Clock, color: "text-accent" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage your AI-generated project architectures
          </p>
        </div>
        <Button data-testid="button-new-project">
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              {...project}
              onClick={() => console.log(`View project ${project.id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
