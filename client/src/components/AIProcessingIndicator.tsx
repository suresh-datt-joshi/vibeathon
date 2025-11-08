import { Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface AIProcessingIndicatorProps {
  stage: string;
  progress: number;
}

export default function AIProcessingIndicator({ stage, progress }: AIProcessingIndicatorProps) {
  return (
    <Card data-testid="card-ai-processing">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <CardTitle className="text-base">AI Processing</CardTitle>
        </div>
        <CardDescription>{stage}</CardDescription>
      </CardHeader>
      <CardContent>
        <Progress value={progress} className="h-2" data-testid="progress-ai" />
        <p className="text-sm text-muted-foreground mt-2">{progress}% complete</p>
      </CardContent>
    </Card>
  );
}
