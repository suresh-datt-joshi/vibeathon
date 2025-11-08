import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { GripVertical, Plus, MoreHorizontal, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import TaskDetailModal from "./TaskDetailModal";
import type { Task } from "@shared/schema";

interface EnhancedKanbanBoardProps {
  projectId: string;
  tasks: Task[];
  onTaskUpdate?: (task: any) => void;
}

export default function EnhancedKanbanBoard({ projectId, tasks, onTaskUpdate }: EnhancedKanbanBoardProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns: Array<{ 
    id: Task["status"]; 
    title: string;
  }> = [
    { id: "backlog", title: "Backlog" },
    { id: "todo", title: "To Do" },
    { id: "in_progress", title: "In Progress" },
    { id: "review", title: "Review" },
    { id: "done", title: "Done" },
  ];

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const getColumnTasks = (status: Task["status"]) => 
    tasks.filter((task) => task.status === status);

  const typeConfig: Record<Task["type"], { className: string; label: string }> = {
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

  const priorityColors: Record<string, string> = {
    low: "text-[hsl(var(--lozenge-low))]",
    medium: "text-[hsl(var(--lozenge-in-progress))]",
    high: "text-[hsl(var(--lozenge-blocked))]",
  };

  return (
    <div className="h-full flex flex-col" data-testid={`kanban-board-${projectId}`}>
      <div className="flex gap-4 overflow-x-auto pb-4 flex-1">
        {columns.map((column) => {
          const columnTasks = getColumnTasks(column.id);
          
          return (
            <div key={column.id} className="flex-shrink-0 w-[280px] flex flex-col">
              <div className="bg-muted/50 rounded-t-lg px-3 py-2 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm uppercase text-muted-foreground tracking-wide">
                      {column.title}
                    </h3>
                    <Badge variant="secondary" className="h-5 px-1.5 text-xs font-normal">
                      {columnTasks.length}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="flex-1 bg-muted/30 p-2 space-y-2 overflow-y-auto rounded-b-lg">
                {columnTasks.map((task) => (
                  <Card 
                    key={task.id} 
                    className="hover-elevate cursor-pointer group bg-card shadow-sm"
                    onClick={() => handleTaskClick(task)}
                    data-testid={`task-${task.id}`}
                  >
                    <CardHeader className="p-3 pb-2">
                      <div className="flex items-start gap-2">
                        <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-mono text-primary font-medium">
                              {task.key}
                            </span>
                            <Button variant="ghost" size="icon" className="h-5 w-5 opacity-0 group-hover:opacity-100">
                              <MoreHorizontal className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-sm leading-snug line-clamp-3">
                            {task.title}
                          </p>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="p-3 pt-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1">
                          <Badge 
                            variant="outline" 
                            className={`text-xs h-5 px-1.5 ${typeConfig[task.type].className}`}
                          >
                            {typeConfig[task.type].label}
                          </Badge>
                          {task.aiGenerated && (
                            <Badge 
                              variant="outline" 
                              className="text-xs h-5 px-1.5 bg-[hsl(var(--lozenge-done-bg))] text-[hsl(var(--lozenge-done))] border-[hsl(var(--lozenge-done))]"
                            >
                              AI
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {task.storyPoints && (
                            <Badge variant="secondary" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                              {task.storyPoints}
                            </Badge>
                          )}
                          {task.assignee && (
                            <Avatar className="h-5 w-5">
                              <AvatarFallback className="text-xs">
                                {task.assignee}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <span className={`text-lg ${priorityColors[task.priority]}`}>
                            •
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      
      <TaskDetailModal
        task={selectedTask}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onUpdateTask={(updatedTask) => {
          setSelectedTask(updatedTask);
          if (onTaskUpdate) {
            onTaskUpdate(updatedTask);
          }
        }}
      />
    </div>
  );
}
