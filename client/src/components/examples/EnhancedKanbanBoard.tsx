import EnhancedKanbanBoard from "../EnhancedKanbanBoard";

export default function EnhancedKanbanBoardExample() {
  const mockTasks = [
    { id: "1", title: "Set up project structure and initial configuration", type: "story" as const, status: "done" as const, priority: "high" as const, storyPoints: 3, assignee: "JD", aiGenerated: true },
    { id: "2", title: "Design comprehensive database schema", type: "story" as const, status: "done" as const, priority: "high" as const, storyPoints: 5, assignee: "SM" },
    { id: "3", title: "Implement user authentication and authorization", type: "epic" as const, status: "in_progress" as const, priority: "high" as const, storyPoints: 13, assignee: "JD", aiGenerated: true },
    { id: "4", title: "Create RESTful API endpoints", type: "story" as const, status: "in_progress" as const, priority: "medium" as const, storyPoints: 8, assignee: "AL" },
    { id: "5", title: "Build user dashboard with analytics", type: "story" as const, status: "todo" as const, priority: "medium" as const, storyPoints: 8, aiGenerated: true },
    { id: "6", title: "Add comprehensive unit tests", type: "subtask" as const, status: "todo" as const, priority: "low" as const, storyPoints: 5 },
    { id: "7", title: "Code review for authentication module", type: "subtask" as const, status: "review" as const, priority: "high" as const, storyPoints: 2, assignee: "SM" },
    { id: "8", title: "Optimize database queries", type: "subtask" as const, status: "backlog" as const, priority: "medium" as const, storyPoints: 3 },
  ];

  return (
    <div className="p-4">
      <EnhancedKanbanBoard projectId="example" tasks={mockTasks} />
    </div>
  );
}
