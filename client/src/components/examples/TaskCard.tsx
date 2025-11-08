import TaskCard from "../TaskCard";

export default function TaskCardExample() {
  return (
    <div className="p-4 max-w-sm space-y-2">
      <TaskCard
        id="1"
        title="Set up authentication system with JWT tokens"
        type="story"
        status="in_progress"
        priority="high"
        storyPoints={5}
      />
      <TaskCard
        id="2"
        title="Design database schema for user management"
        type="subtask"
        status="done"
        priority="medium"
        storyPoints={3}
      />
    </div>
  );
}
