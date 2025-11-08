import ArchitectureDiagram from "../ArchitectureDiagram";

export default function ArchitectureDiagramExample() {
  const mockModules = [
    { id: "1", name: "React SPA", type: "frontend" as const, description: "Main user interface built with React and TypeScript" },
    { id: "2", name: "Component Library", type: "frontend" as const, description: "Reusable UI components with Tailwind CSS" },
    { id: "3", name: "Express API", type: "backend" as const, description: "RESTful API server handling business logic" },
    { id: "4", name: "Auth Service", type: "backend" as const, description: "JWT-based authentication and authorization" },
    { id: "5", name: "PostgreSQL", type: "database" as const, description: "Primary data store for application data" },
    { id: "6", name: "Gemini AI", type: "ai" as const, description: "AI service for architecture generation" },
  ];

  return (
    <div className="p-4">
      <ArchitectureDiagram modules={mockModules} />
    </div>
  );
}
