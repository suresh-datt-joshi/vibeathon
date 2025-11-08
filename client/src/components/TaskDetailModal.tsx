import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { 
  User, 
  Calendar, 
  Tag, 
  Clock,
  MessageSquare,
  Flag,
  CheckCircle2,
} from "lucide-react";
import { statusLozenges, priorityLozenges, TaskStatus, TaskPriority } from "@/lib/statusLozenges";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface Task {
  id: string;
  key: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: string;
  reporter: string;
  type: "epic" | "story" | "subtask";
  storyPoints?: number;
  labels?: string[];
  createdAt: string;
  updatedAt: string;
}

interface TaskDetailModalProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateTask?: (task: Task) => void;
}

export default function TaskDetailModal({ 
  task, 
  open, 
  onOpenChange,
  onUpdateTask 
}: TaskDetailModalProps) {
  const [description, setDescription] = useState("");
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (task && open) {
      setDescription(task.description || "");
      setComment("");
    }
  }, [task, open]);

  if (!task) return null;

  const typeConfig = {
    epic: { 
      className: "bg-[hsl(var(--lozenge-blocked-bg))] text-[hsl(var(--lozenge-blocked))] border-[hsl(var(--lozenge-blocked))]", 
      label: "Epic" 
    },
    story: { 
      className: "bg-[hsl(var(--lozenge-todo-bg))] text-[hsl(var(--lozenge-todo))] border-[hsl(var(--lozenge-todo))]", 
      label: "Story" 
    },
    subtask: { 
      className: "bg-[hsl(var(--lozenge-low-bg))] text-[hsl(var(--lozenge-low))] border-[hsl(var(--lozenge-low))]", 
      label: "Subtask" 
    },
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-5xl max-h-[90vh] p-0 gap-0 overflow-hidden shadow-sm"
        data-testid="dialog-task-detail"
      >
        <DialogHeader className="border-b border-border p-4 pr-12 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={`${typeConfig[task.type].className} text-xs`}>
              {typeConfig[task.type].label}
            </Badge>
            <span className="font-mono text-sm text-muted-foreground" data-testid="text-task-key">
              {task.key}
            </span>
          </div>
          <DialogTitle className="sr-only">{task.title}</DialogTitle>
          <DialogDescription className="sr-only">Task details and metadata</DialogDescription>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold" data-testid="text-task-title">
                {task.title}
              </h2>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description..."
                className="min-h-[120px] resize-none"
                data-testid="textarea-description"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-medium">Activity</h3>
              </div>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback className="text-xs">JD</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <Textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="resize-none"
                      data-testid="textarea-comment"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" data-testid="button-save-comment">
                        Save
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setComment("")}
                        data-testid="button-cancel-comment"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-border">
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className="text-xs">JD</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">John Doe</span>
                        <span className="text-xs text-muted-foreground">2 hours ago</span>
                      </div>
                      <p className="text-sm">Started working on this task</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-80 border-l border-border overflow-y-auto p-6 space-y-6 flex-shrink-0 bg-muted/30">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Status
                </label>
                <Select 
                  value={task.status}
                  onValueChange={(value) => {
                    if (onUpdateTask) {
                      onUpdateTask({ ...task, status: value as TaskStatus });
                    }
                  }}
                >
                  <SelectTrigger data-testid="select-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(statusLozenges).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={`${config.className} text-xs`}>
                            {config.label}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                  <Flag className="h-3.5 w-3.5" />
                  Priority
                </label>
                <Select 
                  value={task.priority}
                  onValueChange={(value) => {
                    if (onUpdateTask) {
                      onUpdateTask({ ...task, priority: value as TaskPriority });
                    }
                  }}
                >
                  <SelectTrigger data-testid="select-priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(priorityLozenges).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={`${config.className} text-xs`}>
                            {config.label}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                  <User className="h-3.5 w-3.5" />
                  Assignee
                </label>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2 h-9"
                  data-testid="button-assignee"
                >
                  {task.assignee ? (
                    <>
                      <Avatar className="h-5 w-5">
                        <AvatarFallback className="text-xs">
                          {task.assignee.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{task.assignee}</span>
                    </>
                  ) : (
                    <span className="text-sm text-muted-foreground">Unassigned</span>
                  )}
                </Button>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                  <User className="h-3.5 w-3.5" />
                  Reporter
                </label>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {task.reporter.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{task.reporter}</span>
                </div>
              </div>

              {task.labels && task.labels.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                    <Tag className="h-3.5 w-3.5" />
                    Labels
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {task.labels.map((label) => (
                      <Badge 
                        key={label} 
                        variant="secondary" 
                        className="text-xs"
                      >
                        {label}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {task.storyPoints && (
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5" />
                    Story Points
                  </label>
                  <Badge variant="secondary" className="w-fit">
                    {task.storyPoints}
                  </Badge>
                </div>
              )}

              <div className="pt-4 border-t border-border space-y-2">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5" />
                  Dates
                </label>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created:</span>
                    <span>{task.createdAt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Updated:</span>
                    <span>{task.updatedAt}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
