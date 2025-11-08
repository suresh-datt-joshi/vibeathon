import ArchitectureDiagram from "../ArchitectureDiagram";

export default function ArchitectureDiagramExample() {
  const mockModules = [
    { id: "1", name: "React SPA", type: "frontend" as const, description: "Main user interface built with React and TypeScript", technologies: ["React", "TypeScript", "Tailwind"] },
    { id: "2", name: "Component Library", type: "frontend" as const, description: "Reusable UI components", technologies: ["Shadcn", "Radix"] },
    { id: "3", name: "Express API", type: "backend" as const, description: "RESTful API server", technologies: ["Express", "Node.js"] },
    { id: "4", name: "Auth Service", type: "backend" as const, description: "JWT authentication", technologies: ["Passport", "JWT"] },
    { id: "5", name: "PostgreSQL", type: "database" as const, description: "Primary data store", technologies: ["PostgreSQL", "Drizzle"] },
    { id: "6", name: "Gemini AI", type: "ai" as const, description: "Architecture generation", technologies: ["Gemini", "LangChain"] },
  ];

  return (
    <div className="p-4">
      <ArchitectureDiagram modules={mockModules} />
    </div>
  );
}
