import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, Server, Globe, Cpu, ArrowRight } from "lucide-react";

interface Module {
  id: string;
  name: string;
  type: "frontend" | "backend" | "database" | "ai";
  description: string;
}

interface ArchitectureDiagramProps {
  modules: Module[];
}

export default function ArchitectureDiagram({ modules }: ArchitectureDiagramProps) {
  const typeConfig = {
    frontend: { icon: Globe, color: "bg-primary text-primary-foreground", label: "Frontend" },
    backend: { icon: Server, color: "bg-secondary text-secondary-foreground", label: "Backend" },
    database: { icon: Database, color: "bg-accent text-accent-foreground", label: "Database" },
    ai: { icon: Cpu, color: "bg-chart-3 text-white", label: "AI Service" },
  };

  const groupedModules = modules.reduce((acc, module) => {
    if (!acc[module.type]) acc[module.type] = [];
    acc[module.type].push(module);
    return acc;
  }, {} as Record<string, Module[]>);

  return (
    <div className="space-y-6" data-testid="architecture-diagram">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(groupedModules).map(([type, mods]) => {
          const config = typeConfig[type as keyof typeof typeConfig];
          const Icon = config.icon;
          
          return (
            <div key={type} className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge className={config.color}>
                  <Icon className="h-3 w-3 mr-1" />
                  {config.label}
                </Badge>
              </div>
              <div className="space-y-2">
                {mods.map((module) => (
                  <Card key={module.id} className="hover-elevate">
                    <CardHeader className="p-4">
                      <CardTitle className="text-sm font-medium">{module.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {module.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <span>Frontend</span>
        <ArrowRight className="h-4 w-4" />
        <span>Backend</span>
        <ArrowRight className="h-4 w-4" />
        <span>Database</span>
      </div>
    </div>
  );
}
