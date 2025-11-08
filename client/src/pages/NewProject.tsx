import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import AIProcessingIndicator from "@/components/AIProcessingIndicator";
import { Sparkles, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function NewProject() {
  const [projectName, setProjectName] = useState("");
  const [requirements, setRequirements] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleGenerate = () => {
    setIsProcessing(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsProcessing(false);
            console.log("Generation complete!");
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create New Project</h1>
        <p className="text-muted-foreground mt-1">
          Describe your project idea and let AI generate the complete architecture
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Project Details
          </CardTitle>
          <CardDescription>
            Provide a name and detailed requirements for your project
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
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements">Requirements</Label>
            <Textarea
              id="requirements"
              placeholder="Describe what you want to build. Include features, user flows, and any specific technical requirements..."
              className="min-h-[200px]"
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              data-testid="input-requirements"
            />
            <p className="text-xs text-muted-foreground">
              Tip: Be as detailed as possible. Include features, user types, data requirements, and integrations.
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              className="flex-1"
              onClick={handleGenerate}
              disabled={!projectName || !requirements || isProcessing}
              data-testid="button-generate"
            >
              <Sparkles className="h-4 w-4 mr-2" />
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
          stage="Analyzing requirements and generating project architecture..."
          progress={progress}
        />
      )}

      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-base">What happens next?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold flex-shrink-0">
                1
              </div>
              <div>
                <p className="font-medium text-sm">AI Analysis</p>
                <p className="text-xs text-muted-foreground">
                  Gemini AI analyzes your requirements and breaks down the system
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold flex-shrink-0">
                2
              </div>
              <div>
                <p className="font-medium text-sm">Architecture Generation</p>
                <p className="text-xs text-muted-foreground">
                  Creates modules, services, APIs, and database schemas
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold flex-shrink-0">
                3
              </div>
              <div>
                <p className="font-medium text-sm">Task Breakdown</p>
                <p className="text-xs text-muted-foreground">
                  Generates epics, stories, and subtasks with estimates
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold flex-shrink-0">
                4
              </div>
              <div>
                <p className="font-medium text-sm">JSON Export</p>
                <p className="text-xs text-muted-foreground">
                  Complete specification ready for download and import
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
