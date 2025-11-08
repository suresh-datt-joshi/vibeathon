import { Badge } from "@/components/ui/badge";

type Status = "pending" | "processing" | "completed" | "error";

interface StatusBadgeProps {
  status: Status;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const variants: Record<Status, { label: string; className: string }> = {
    pending: { label: "Pending", className: "bg-muted text-muted-foreground" },
    processing: { label: "Processing", className: "bg-primary text-primary-foreground" },
    completed: { label: "Completed", className: "bg-secondary text-secondary-foreground" },
    error: { label: "Error", className: "bg-destructive text-destructive-foreground" },
  };

  const { label, className } = variants[status];

  return (
    <Badge className={className} data-testid={`badge-status-${status}`}>
      {label}
    </Badge>
  );
}
