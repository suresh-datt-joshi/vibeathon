import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import Breadcrumbs from "@/components/Breadcrumbs";
import AIProcessingIndicator from "@/components/AIProcessingIndicator";
import { Sparkles, Zap, Info } from "lucide-react";
import { useState } from "react";

export default function NewProject() {
  const [projectName, setProjectName] = useState("");
  const [projectKey, setProjectKey] = useState("");
  const [requirements, setRequirements] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState("");

  const stages = [
    "Analyzing requirements...",
    "Generating architecture modules...",
    "Creating database schema...",
    "Breaking down into tasks...",
  ];

  const handleGenerate = () => {
    setIsProcessing(true);
    setProgress(0);
    setStage(stages[0]);
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 5;
        const stageIndex = Math.floor(newProgress / 25);
        if (stageIndex < stages.length) {
          setStage(stages[stageIndex]);
        }
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsProcessing(false);
            console.log("Generation complete!");
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 150);
  };

  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="border-b border-border bg-card px-6 py-4">
        <Breadcrumbs items={[
          { label: "Projects", href: "/" },
          { label: "Create Project" }
        ]} />
        <h1 className="text-2xl font-semibold mt-3">Create AI-Powered Project</h1>
      </div>

      <div className="p-6 space-y-6">
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-base font-semibold">Project Details</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="project-name">
                  Project Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="project-name"
                  placeholder="e.g., E-commerce Platform"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  data-testid="input-project-name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="project-key">
                  Project Key <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="project-key"
                  placeholder="e.g., ECOM"
                  value={projectKey}
                  onChange={(e) => setProjectKey(e.target.value.toUpperCase())}
                  data-testid="input-project-key"
                  className="font-mono"
                  maxLength={10}
                />
                <p className="text-xs text-muted-foreground">
                  Used as a prefix for task IDs (e.g., ECOM-1, ECOM-2)
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">
                Requirements <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="requirements"
                placeholder="Describe your project in detail. Include features, user types, integrations, and technical requirements..."
                className="min-h-[200px] resize-none"
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                data-testid="input-requirements"
              />
              <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                <Info className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <div className="text-sm space-y-1">
                  <p className="font-medium">Tips for better results:</p>
                  <ul className="text-muted-foreground space-y-0.5 ml-4 list-disc">
                    <li>Specify key features and user flows</li>
                    <li>Mention any third-party integrations needed</li>
                    <li>Include technical requirements or constraints</li>
                    <li>Define user roles and permissions if applicable</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {isProcessing && (
          <AIProcessingIndicator
            stage={stage}
            progress={progress}
            substage={progress < 50 ? "Analyzing..." : "Generating..."}
          />
        )}

        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <CardTitle className="text-base font-semibold">AI Generation Process</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { 
                  step: "1", 
                  title: "Analyze", 
                  desc: "AI analyzes your requirements and identifies key features" 
                },
                { 
                  step: "2", 
                  title: "Design", 
                  desc: "Generates optimal architecture with frontend, backend, and database modules" 
                },
                { 
                  step: "3", 
                  title: "Tasks", 
                  desc: "Breaks down implementation into actionable tasks with priorities" 
                },
                { 
                  step: "4", 
                  title: "Export", 
                  desc: "Provides complete JSON specification ready for export" 
                },
              ].map(({ step, title, desc }) => (
                <div key={step} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="h-6 w-6 p-0 flex items-center justify-center">
                      {step}
                    </Badge>
                    <h3 className="font-semibold text-sm">{title}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between pt-4 border-t">
          <Button variant="outline" data-testid="button-cancel">
            Cancel
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={!projectName || !projectKey || !requirements || isProcessing}
            data-testid="button-generate"
            className="gap-2"
          >
            <Zap className="h-4 w-4" />
            Generate Project Architecture
          </Button>
        </div>
      </div>
    </div>
  );
}
