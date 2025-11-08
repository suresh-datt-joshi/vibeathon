export type TaskStatus = "backlog" | "todo" | "in_progress" | "review" | "done";
export type TaskPriority = "lowest" | "low" | "medium" | "high" | "highest";

export interface LozengeStyle {
  label: string;
  className: string;
}

export const statusLozenges: Record<TaskStatus, LozengeStyle> = {
  backlog: {
    label: "Backlog",
    className: "bg-[hsl(var(--lozenge-low-bg))] text-[hsl(var(--lozenge-low))] border-[hsl(var(--lozenge-low))]",
  },
  todo: {
    label: "To Do",
    className: "bg-[hsl(var(--lozenge-todo-bg))] text-[hsl(var(--lozenge-todo))] border-[hsl(var(--lozenge-todo))]",
  },
  in_progress: {
    label: "In Progress",
    className: "bg-[hsl(var(--lozenge-in-progress-bg))] text-[hsl(var(--lozenge-in-progress))] border-[hsl(var(--lozenge-in-progress))]",
  },
  review: {
    label: "In Review",
    className: "bg-[hsl(var(--lozenge-in-progress-bg))] text-[hsl(var(--lozenge-in-progress))] border-[hsl(var(--lozenge-in-progress))]",
  },
  done: {
    label: "Done",
    className: "bg-[hsl(var(--lozenge-done-bg))] text-[hsl(var(--lozenge-done))] border-[hsl(var(--lozenge-done))]",
  },
};

export const priorityLozenges: Record<TaskPriority, LozengeStyle> = {
  lowest: {
    label: "Lowest",
    className: "bg-[hsl(var(--lozenge-low-bg))] text-[hsl(var(--lozenge-low))] border-[hsl(var(--lozenge-low))]",
  },
  low: {
    label: "Low",
    className: "bg-[hsl(var(--lozenge-low-bg))] text-[hsl(var(--lozenge-low))] border-[hsl(var(--lozenge-low))]",
  },
  medium: {
    label: "Medium",
    className: "bg-[hsl(var(--lozenge-in-progress-bg))] text-[hsl(var(--lozenge-in-progress))] border-[hsl(var(--lozenge-in-progress))]",
  },
  high: {
    label: "High",
    className: "bg-[hsl(var(--lozenge-blocked-bg))] text-[hsl(var(--lozenge-blocked))] border-[hsl(var(--lozenge-blocked))]",
  },
  highest: {
    label: "Highest",
    className: "bg-[hsl(var(--lozenge-blocked-bg))] text-[hsl(var(--lozenge-blocked))] border-[hsl(var(--lozenge-blocked))]",
  },
};
