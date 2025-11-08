import KanbanBoard from "../KanbanBoard";

export default function KanbanBoardExample() {
  const mockTasks = [
    { id: "1", title: "Set up project structure", type: "story" as const, status: "done" as const, priority: "high" as const, storyPoints: 3 },
    { id: "2", title: "Design database schema", type: "story" as const, status: "done" as const, priority: "high" as const, storyPoints: 5 },
    { id: "3", title: "Implement authentication", type: "epic" as const, status: "in_progress" as const, priority: "high" as const, storyPoints: 8 },
    { id: "4", title: "Create API endpoints", type: "story" as const, status: "in_progress" as const, priority: "medium" as const, storyPoints: 5 },
    { id: "5", title: "Build user dashboard", type: "story" as const, status: "todo" as const, priority: "medium" as const, storyPoints: 8 },
    { id: "6", title: "Add unit tests", type: "subtask" as const, status: "todo" as const, priority: "low" as const, storyPoints: 3 },
    { id: "7", title: "Code review authentication", type: "subtask" as const, status: "review" as const, priority: "high" as const, storyPoints: 2 },
  ];

  return (
    <div className="p-4">
      <KanbanBoard tasks={mockTasks} />
    </div>
  );
}
