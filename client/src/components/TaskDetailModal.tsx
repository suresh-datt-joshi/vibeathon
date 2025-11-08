import { useState, useEffect, useMemo, useCallback } from "react";
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
  Copy,
  Check,
} from "lucide-react";
import { statusLozenges, priorityLozenges, TaskStatus, TaskPriority } from "@/lib/statusLozenges";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Task } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  onUpdateTask,
}: TaskDetailModalProps) {
  const [description, setDescription] = useState("");
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (task && open) {
      setCurrentTask(task);
      setDescription(task.description || "");
    }

    if (!open) {
      setCurrentTask(null);
    }
  }, [task, open]);

  const typeConfig: Record<string, { className: string; label: string }> = {
    epic: {
      className:
        "bg-[hsl(var(--lozenge-blocked-bg))] text-[hsl(var(--lozenge-blocked))] border-[hsl(var(--lozenge-blocked))]",
      label: "Epic",
    },
    story: {
      className:
        "bg-[hsl(var(--lozenge-todo-bg))] text-[hsl(var(--lozenge-todo))] border-[hsl(var(--lozenge-todo))]",
      label: "Story",
    },
    subtask: {
      className:
        "bg-[hsl(var(--lozenge-low-bg))] text-[hsl(var(--lozenge-low))] border-[hsl(var(--lozenge-low))]",
      label: "Subtask",
    },
  };

  const activeTypeConfig = currentTask
    ? typeConfig[currentTask.type] || {
      className: "bg-muted text-muted-foreground border-muted-foreground",
      label:
        currentTask.type.charAt(0).toUpperCase() + currentTask.type.slice(1),
    }
    : {
      className: "bg-muted text-muted-foreground border-muted-foreground",
      label: "",
    };

  const handleStatusChange = (value: TaskStatus) => {
    if (!currentTask) return;

    const updatedTask: Task = { ...currentTask, status: value };
    setCurrentTask(updatedTask);
    onUpdateTask?.(updatedTask);
  };

  const handlePriorityChange = (value: TaskPriority) => {
    if (!currentTask) return;

    const updatedTask: Task = { ...currentTask, priority: value };
    setCurrentTask(updatedTask);
    onUpdateTask?.(updatedTask);
  };

  const handleDescriptionSave = () => {
    if (!currentTask) return;

    const updatedTask: Task = { ...currentTask, description };
    setCurrentTask(updatedTask);
    onUpdateTask?.(updatedTask);
  };

  const statusConfig = currentTask
    ? statusLozenges[currentTask.status as TaskStatus]
    : undefined;

  const statusLabel =
    statusConfig?.label ||
    currentTask?.status?.replace(/-/g, " ") ||
    "";

  const priorityConfig = currentTask
    ? priorityLozenges[currentTask.priority as TaskPriority]
    : undefined;

  const priorityLabel =
    priorityConfig?.label ||
    currentTask?.priority?.replace(/-/g, " ") ||
    "";

  const agentPrompt = useMemo(() => {
    if (!currentTask) return "";

    const lines: string[] = [];
    lines.push("You are an autonomous engineering agent.");
    lines.push(
      `Your mission is to complete the ${currentTask.type.toUpperCase()} ${currentTask.key} titled "${currentTask.title}".`
    );

    const detailParts: string[] = [];
    detailParts.push(`• Priority: ${priorityLabel}`);
    detailParts.push(`• Current status: ${statusLabel}`);
    detailParts.push(
      `• Reporter: ${currentTask.reporter}${currentTask.assignee ? ` | Assignee: ${currentTask.assignee}` : ""
      }`
    );
    if (currentTask.storyPoints) {
      detailParts.push(`• Estimate: ${currentTask.storyPoints} story points`);
    }
    if (currentTask.labels?.length) {
      detailParts.push(`• Labels: ${currentTask.labels.join(", ")}`);
    }

    lines.push("");
    lines.push("Context:");
    lines.push(detailParts.join("\n"));

    lines.push("");
    lines.push("Primary objective:");
    if (description.trim()) {
      lines.push(description.trim());
    } else {
      lines.push(
        "The task currently lacks a detailed description. Clarify requirements with the team or infer them responsibly based on the codebase."
      );
    }

    lines.push("");
    lines.push("Deliverables:");
    lines.push(
      "- Outline the plan of attack, including impacted files or modules."
    );
    lines.push("- Provide the implementation or precise code edits.");
    lines.push("- List validation steps and tests to confirm success.");
    lines.push("- Highlight any assumptions or follow-up questions.");

    lines.push("");
    lines.push(
      "Respond with a structured execution plan followed by the proposed code changes."
    );

    return lines.join("\n");
  }, [
    currentTask,
    description,
    priorityLabel,
    statusLabel,
  ]);

  const handleCopyPrompt = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(agentPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy prompt", error);
    }
  }, [agentPrompt]);
  if (!currentTask) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-5xl max-h-[90vh] p-0 gap-0 overflow-hidden shadow-sm"
        data-testid="dialog-task-detail"
      >
        <DialogHeader className="border-b border-border p-4 pr-12 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={`${activeTypeConfig.className} text-xs`}
            >
              {activeTypeConfig.label}
            </Badge>
            <span
              className="font-mono text-sm text-muted-foreground"
              data-testid="text-task-key"
            >
              {currentTask.key}
            </span>
          </div>
          <DialogTitle className="sr-only">{currentTask.title}</DialogTitle>
          <DialogDescription className="sr-only">
            Task details and metadata
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold" data-testid="text-task-title">
                {currentTask.title}
              </h2>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Description
              </label>
              <Textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Add a description..."
                className="min-h-[120px] resize-none"
                data-testid="textarea-description"
              />
              <div className="flex justify-end">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleDescriptionSave}
                  disabled={description === (currentTask.description || "")}
                  data-testid="button-save-description"
                >
                  Save description
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center justify-between">
                <span>Agent Prompt</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 gap-2"
                  onClick={handleCopyPrompt}
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
              </label>
              <div className="rounded-md border border-border bg-muted/40 p-4 max-h-72 overflow-y-auto">
                <pre className="text-sm whitespace-pre-wrap font-sans leading-relaxed text-muted-foreground">
                  {agentPrompt}
                </pre>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-medium">Activity</h3>
              </div>

              <div className="border border-dashed rounded-lg p-4 text-sm text-muted-foreground text-center bg-muted/30">
                Task activity will appear here once collaboration is enabled.
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
                  value={currentTask.status}
                  onValueChange={(value) =>
                    handleStatusChange(value as TaskStatus)
                  }
                >
                  <SelectTrigger data-testid="select-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(statusLozenges).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={`${config.className} text-xs`}
                          >
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
                  value={currentTask.priority}
                  onValueChange={(value) =>
                    handlePriorityChange(value as TaskPriority)
                  }
                >
                  <SelectTrigger data-testid="select-priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(priorityLozenges).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={`${config.className} text-xs`}
                          >
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
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-2 h-9"
                        data-testid="button-assignee"
                        disabled
                      >
                        {currentTask.assignee ? (
                          <>
                            <Avatar className="h-5 w-5">
                              <AvatarFallback className="text-xs">
                                {currentTask.assignee.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">
                              {currentTask.assignee}
                            </span>
                          </>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            Assignment coming soon
                          </span>
                        )}
                      </Button>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent sideOffset={6}>
                    Assign teammates once user management is connected.
                  </TooltipContent>
                </Tooltip>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                  <User className="h-3.5 w-3.5" />
                  Reporter
                </label>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {currentTask.reporter.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{currentTask.reporter}</span>
                </div>
              </div>

              {currentTask.labels && currentTask.labels.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                    <Tag className="h-3.5 w-3.5" />
                    Labels
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {currentTask.labels.map((label) => (
                      <Badge key={label} variant="secondary" className="text-xs">
                        {label}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {currentTask.storyPoints && (
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5" />
                    Story Points
                  </label>
                  <Badge variant="secondary" className="w-fit">
                    {currentTask.storyPoints}
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
                    <span>
                      {formatDistanceToNow(new Date(currentTask.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Updated:</span>
                    <span>
                      {formatDistanceToNow(new Date(currentTask.updatedAt), {
                        addSuffix: true,
                      })}
                    </span>
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
