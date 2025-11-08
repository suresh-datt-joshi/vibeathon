import { Loader2, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface AIProcessingIndicatorProps {
  stage: string;
  progress: number;
  substage?: string;
}

export default function AIProcessingIndicator({ stage, progress, substage }: AIProcessingIndicatorProps) {
  return (
    <Card className="glass border-glow" data-testid="card-ai-processing">
      <div className="absolute top-0 left-0 right-0 h-0.5 gradient-aurora" />
      
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Sparkles className="h-5 w-5 text-primary" />
            <Loader2 className="h-5 w-5 animate-spin text-accent absolute inset-0 opacity-50" />
          </div>
          <CardTitle className="text-base">AI Processing</CardTitle>
        </div>
        <CardDescription className="flex items-center gap-2">
          <span className="pulse-glow">{stage}</span>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="relative">
          <Progress value={progress} className="h-2" data-testid="progress-ai" />
          <div 
            className="absolute top-0 left-0 h-2 bg-gradient-to-r from-primary via-accent to-secondary rounded-full transition-all duration-500 opacity-50 blur-sm"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">{progress}% complete</p>
          {substage && (
            <p className="text-xs text-muted-foreground">{substage}</p>
          )}
        </div>

        <div className="grid grid-cols-4 gap-2 pt-2">
          {[
            { label: "Analyze", step: 1 },
            { label: "Design", step: 2 },
            { label: "Generate", step: 3 },
            { label: "Export", step: 4 },
          ].map(({ label, step }) => {
            const stepProgress = Math.max(0, Math.min(100, (progress - (step - 1) * 25) * 4));
            const isActive = stepProgress > 0;
            
            return (
              <div key={step} className="text-center space-y-1">
                <div className={`h-1 rounded-full overflow-hidden ${isActive ? 'bg-primary/20' : 'bg-muted'}`}>
                  <div 
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${stepProgress}%` }}
                  />
                </div>
                <p className={`text-xs ${isActive ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                  {label}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
