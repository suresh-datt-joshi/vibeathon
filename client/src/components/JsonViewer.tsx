import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface JsonViewerProps {
  data: any;
  title?: string;
}

export default function JsonViewer({ data, title = "JSON Output" }: JsonViewerProps) {
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    toast({ title: "Copied to clipboard" });
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "project-specification.json";
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Downloaded successfully" });
  };

  return (
    <Card data-testid="card-json-viewer">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{title}</CardTitle>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleCopy} data-testid="button-copy-json">
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDownload} data-testid="button-download-json">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <pre className="text-xs font-mono bg-muted p-4 rounded-md overflow-auto max-h-[400px]">
          {JSON.stringify(data, null, 2)}
        </pre>
      </CardContent>
    </Card>
  );
}
