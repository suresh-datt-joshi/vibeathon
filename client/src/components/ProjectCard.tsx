import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Calendar, Layers } from "lucide-react";
import StatusBadge from "./StatusBadge";

interface ProjectCardProps {
  id: string;
  name: string;
  description: string;
  status: "pending" | "processing" | "completed" | "error";
  createdAt: string;
  moduleCount: number;
  taskCount: number;
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
  onClick,
}: ProjectCardProps) {
  return (
    <Card className="hover-elevate" data-testid={`card-project-${id}`}>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg truncate">{name}</CardTitle>
            <CardDescription className="line-clamp-2 mt-1">{description}</CardDescription>
          </div>
          <StatusBadge status={status} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Layers className="h-3 w-3" />
              <span>{moduleCount} modules</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{taskCount} tasks</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{createdAt}</span>
          <Button variant="ghost" size="sm" onClick={onClick} data-testid={`button-view-project-${id}`}>
            View Details
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
