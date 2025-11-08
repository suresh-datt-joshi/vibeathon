import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import TaskCard from "./TaskCard";

interface Task {
  id: string;
  title: string;
  type: "epic" | "story" | "subtask";
  status: "backlog" | "todo" | "in_progress" | "review" | "done";
  priority: "low" | "medium" | "high";
  storyPoints?: number;
}

interface KanbanBoardProps {
  tasks: Task[];
}

export default function KanbanBoard({ tasks }: KanbanBoardProps) {
  const columns: Array<{ id: Task["status"]; title: string }> = [
    { id: "backlog", title: "Backlog" },
    { id: "todo", title: "To Do" },
    { id: "in_progress", title: "In Progress" },
    { id: "review", title: "Review" },
    { id: "done", title: "Done" },
  ];

  const getColumnTasks = (status: Task["status"]) => 
    tasks.filter((task) => task.status === status);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4" data-testid="kanban-board">
      {columns.map((column) => {
        const columnTasks = getColumnTasks(column.id);
        return (
          <div key={column.id} className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">{column.title}</h3>
              <Badge variant="secondary" className="text-xs">
                {columnTasks.length}
              </Badge>
            </div>
            <div className="flex flex-col gap-2 min-h-[200px] p-2 rounded-md bg-muted/30">
              {columnTasks.map((task) => (
                <TaskCard key={task.id} {...task} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
