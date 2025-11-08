import StatusBadge from "../StatusBadge";

export default function StatusBadgeExample() {
  return (
    <div className="flex gap-2 p-4">
      <StatusBadge status="pending" />
      <StatusBadge status="processing" />
      <StatusBadge status="completed" />
      <StatusBadge status="error" />
    </div>
  );
}
