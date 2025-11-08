import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Clock } from "lucide-react";

type TaskType = "epic" | "story" | "subtask";
type TaskStatus = "backlog" | "todo" | "in_progress" | "review" | "done";

interface TaskCardProps {
  id: string;
  title: string;
  type: TaskType;
  status: TaskStatus;
  priority: "low" | "medium" | "high";
  storyPoints?: number;
}

export default function TaskCard({ id, title, type, status, priority, storyPoints }: TaskCardProps) {
  const typeColors: Record<TaskType, string> = {
    epic: "bg-accent text-accent-foreground",
    story: "bg-primary text-primary-foreground",
    subtask: "bg-secondary text-secondary-foreground",
  };

  const priorityColors: Record<string, string> = {
    low: "text-muted-foreground",
    medium: "text-primary",
    high: "text-destructive",
  };

  const statusIcons: Record<TaskStatus, JSX.Element> = {
    backlog: <Circle className="h-3 w-3" />,
    todo: <Circle className="h-3 w-3" />,
    in_progress: <Clock className="h-3 w-3 text-primary" />,
    review: <Clock className="h-3 w-3 text-accent" />,
    done: <CheckCircle2 className="h-3 w-3 text-secondary" />,
  };

  return (
    <Card className="hover-elevate cursor-pointer" data-testid={`card-task-${id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm font-medium flex-1 line-clamp-2">{title}</CardTitle>
          {statusIcons[status]}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <Badge variant="outline" className={`${typeColors[type]} text-xs`}>
              {type}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            {storyPoints && (
              <span className="text-xs text-muted-foreground">{storyPoints} pts</span>
            )}
            <span className={`text-xs font-medium ${priorityColors[priority]}`}>
              {priority.toUpperCase()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
