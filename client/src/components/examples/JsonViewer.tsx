import JsonViewer from "../JsonViewer";

export default function JsonViewerExample() {
  const mockData = {
    project: {
      name: "E-commerce Platform",
      version: "1.0.0",
      modules: [
        { name: "Frontend", type: "React", dependencies: ["react", "tailwind"] },
        { name: "Backend", type: "Express", dependencies: ["express", "postgresql"] },
      ],
      tasks: [
        { id: 1, title: "Setup authentication", status: "completed", priority: "high" },
        { id: 2, title: "Build product catalog", status: "in_progress", priority: "medium" },
      ],
    },
  };

  return (
    <div className="p-4 max-w-2xl">
      <JsonViewer data={mockData} title="Project Specification" />
    </div>
  );
}
