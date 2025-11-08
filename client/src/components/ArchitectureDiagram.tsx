import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, Server, Globe, Cpu, ArrowRight, Sparkles } from "lucide-react";

interface Module {
  id: string;
  name: string;
  type: "frontend" | "backend" | "database" | "ai";
  description: string;
  technologies?: string[];
}

interface ArchitectureDiagramProps {
  modules: Module[];
}

export default function ArchitectureDiagram({ modules }: ArchitectureDiagramProps) {
  const typeConfig = {
    frontend: { 
      icon: Globe, 
      gradient: "from-primary/20 to-primary/5",
      border: "border-primary/30",
      badge: "bg-primary/10 text-primary",
      label: "Frontend" 
    },
    backend: { 
      icon: Server, 
      gradient: "from-secondary/20 to-secondary/5",
      border: "border-secondary/30",
      badge: "bg-secondary/10 text-secondary",
      label: "Backend" 
    },
    database: { 
      icon: Database, 
      gradient: "from-accent/20 to-accent/5",
      border: "border-accent/30",
      badge: "bg-accent/10 text-accent",
      label: "Database" 
    },
    ai: { 
      icon: Cpu, 
      gradient: "from-chart-3/20 to-chart-3/5",
      border: "border-chart-3/30",
      badge: "bg-chart-3/10 text-chart-3",
      label: "AI Service" 
    },
  };

  const groupedModules = modules.reduce((acc, module) => {
    if (!acc[module.type]) acc[module.type] = [];
    acc[module.type].push(module);
    return acc;
  }, {} as Record<string, Module[]>);

  return (
    <div className="space-y-6" data-testid="architecture-diagram">
      <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground py-4">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-primary" />
          <span>Frontend</span>
        </div>
        <ArrowRight className="h-4 w-4" />
        <div className="flex items-center gap-2">
          <Server className="h-4 w-4 text-secondary" />
          <span>Backend</span>
        </div>
        <ArrowRight className="h-4 w-4" />
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4 text-accent" />
          <span>Database</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(groupedModules).map(([type, mods]) => {
          const config = typeConfig[type as keyof typeof typeConfig];
          const Icon = config.icon;
          
          return (
            <div key={type} className="space-y-3">
              <Badge className={`${config.badge} border ${config.border}`}>
                <Icon className="h-3 w-3 mr-1" />
                {config.label}
              </Badge>
              
              <div className="space-y-3">
                {mods.map((module) => (
                  <Card 
                    key={module.id} 
                    className={`glass-strong hover-elevate border ${config.border} relative overflow-hidden`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} -z-10`} />
                    
                    <CardHeader className="p-4 pb-3">
                      <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {module.name}
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="p-4 pt-0 space-y-3">
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {module.description}
                      </p>
                      
                      {module.technologies && module.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {module.technologies.map((tech) => (
                            <Badge 
                              key={tech} 
                              variant="outline" 
                              className="text-xs px-2 py-0"
                            >
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <Card className="glass-light">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            AI-Generated Architecture
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            This architecture was automatically generated based on your project requirements. 
            Each module has been designed to follow best practices and ensure scalability.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
