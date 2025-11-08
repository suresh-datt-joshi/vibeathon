import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import PageContainer from "@/components/PageContainer";

export default function Settings() {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  return (
    <div className="h-full overflow-auto">
      <PageContainer className="py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground mt-2">
              Manage your account settings and preferences
            </p>
          </div>

          <Separator />

          <Card data-testid="card-account-settings">
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Update your account information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  defaultValue="John Doe"
                  data-testid="input-name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue="john.doe@example.com"
                  data-testid="input-email"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  defaultValue="Acme Inc."
                  data-testid="input-company"
                />
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-ai-settings">
            <CardHeader>
              <CardTitle>AI Generation Settings</CardTitle>
              <CardDescription>
                Configure how AI generates project plans
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-generate">Auto-generate tasks</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically create task breakdowns for new projects
                  </p>
                </div>
                <Switch
                  id="auto-generate"
                  defaultChecked
                  data-testid="switch-auto-generate"
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="detailed-specs">Detailed specifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Include developer specifications in AI output
                  </p>
                </div>
                <Switch
                  id="detailed-specs"
                  defaultChecked
                  data-testid="switch-detailed-specs"
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="architecture-diagrams">Architecture diagrams</Label>
                  <p className="text-sm text-muted-foreground">
                    Generate visual architecture diagrams
                  </p>
                </div>
                <Switch
                  id="architecture-diagrams"
                  data-testid="switch-architecture-diagrams"
                />
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-notifications">
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Choose what notifications you receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Email notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email updates about your projects
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  defaultChecked
                  data-testid="switch-email-notifications"
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="task-updates">Task updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when tasks are updated
                  </p>
                </div>
                <Switch
                  id="task-updates"
                  defaultChecked
                  data-testid="switch-task-updates"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline" data-testid="button-cancel">
              Cancel
            </Button>
            <Button onClick={handleSave} data-testid="button-save">
              Save changes
            </Button>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
