import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Calendar, Layers, TrendingUp } from "lucide-react";
import StatusBadge from "./StatusBadge";

interface ProjectCardProps {
  id: string;
  name: string;
  description: string;
  status: "pending" | "processing" | "completed" | "error";
  createdAt: string;
  moduleCount: number;
  taskCount: number;
  completionRate?: number;
  onClick?: () => void;
}

export default function ProjectCard({
  id,
  name,
  description,
  status,
  createdAt,
  moduleCount,
  taskCount,
  completionRate = 0,
  onClick,
}: ProjectCardProps) {
  return (
    <Card 
      className="glass hover-elevate group cursor-pointer relative overflow-hidden" 
      data-testid={`card-project-${id}`}
      onClick={onClick}
    >
      <div className="absolute top-0 left-0 right-0 h-1 gradient-aurora" />
      {status === "processing" && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-accent animate-pulse" />
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg truncate flex items-center gap-2">
              {name}
              {status === "processing" && (
                <div className="h-2 w-2 rounded-full bg-accent pulse-glow" />
              )}
            </CardTitle>
          </div>
          <StatusBadge status={status} />
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{description}</p>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Layers className="h-3.5 w-3.5" />
            <span className="font-medium">{moduleCount}</span>
            <span className="text-xs">modules</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span className="font-medium">{taskCount}</span>
            <span className="text-xs">tasks</span>
          </div>
        </div>

        {completionRate > 0 && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Progress
              </span>
              <span className="font-semibold">{completionRate}%</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full gradient-aurora transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <span className="text-xs text-muted-foreground">{createdAt}</span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
            data-testid={`button-view-project-${id}`}
          >
            <span className="text-xs">View</span>
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
