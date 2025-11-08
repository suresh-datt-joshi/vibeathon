import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import AIProcessingIndicator from "@/components/AIProcessingIndicator";
import { Sparkles, Zap, Layers, FileJson } from "lucide-react";
import { useState } from "react";

export default function NewProject() {
  const [projectName, setProjectName] = useState("");
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

  const examples = [
    "Build a food delivery app with restaurant listings, cart, and order tracking",
    "Create a fitness tracking app with workout plans and progress analytics",
    "Develop a real estate platform with property listings and virtual tours",
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="glass-strong rounded-lg p-6">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Sparkles className="h-7 w-7 text-primary" />
          Create New Project
        </h1>
        <p className="text-muted-foreground mt-2">
          Describe your project idea and let AI generate the complete architecture, tasks, and specifications
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Project Details
              </CardTitle>
              <CardDescription>
                Provide detailed requirements for best AI-generated results
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="project-name">Project Name</Label>
                <Input
                  id="project-name"
                  placeholder="e.g., E-commerce Platform"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  data-testid="input-project-name"
                  className="glass-light"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Requirements</Label>
                <Textarea
                  id="requirements"
                  placeholder="Describe your project in detail. Include features, user types, integrations, and technical requirements..."
                  className="min-h-[240px] glass-light"
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  data-testid="input-requirements"
                />
                <div className="flex items-start gap-2">
                  <Zap className="h-3.5 w-3.5 text-primary mt-0.5" />
                  <p className="text-xs text-muted-foreground">
                    Be specific about features, user flows, data requirements, and external integrations for optimal results.
                  </p>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  className="flex-1 gap-2"
                  onClick={handleGenerate}
                  disabled={!projectName || !requirements || isProcessing}
                  data-testid="button-generate"
                >
                  <Sparkles className="h-4 w-4" />
                  Generate Architecture
                </Button>
                <Button variant="outline" data-testid="button-save-draft">
                  Save Draft
                </Button>
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
        </div>

        <div className="space-y-4">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-base">Example Prompts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {examples.map((example, i) => (
                <button
                  key={i}
                  onClick={() => setRequirements(example)}
                  className="w-full text-left p-3 rounded-lg glass-light hover-elevate text-xs transition-all"
                >
                  {example}
                </button>
              ))}
            </CardContent>
          </Card>

          <Card className="glass-strong relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 gradient-aurora" />
            <CardHeader>
              <CardTitle className="text-base">AI Process</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { icon: Sparkles, label: "Analyze", desc: "AI analyzes requirements" },
                  { icon: Layers, label: "Design", desc: "Generate architecture" },
                  { icon: Zap, label: "Tasks", desc: "Break into actionable items" },
                  { icon: FileJson, label: "Export", desc: "Complete JSON output" },
                ].map(({ icon: Icon, label, desc }, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{label}</p>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
