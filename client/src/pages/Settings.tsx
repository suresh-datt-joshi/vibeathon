import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import PageContainer from "@/components/PageContainer";
import { useState, useEffect } from "react";

interface SettingsState {
  name: string;
  email: string;
  company: string;
  autoGenerate: boolean;
  detailedSpecs: boolean;
  architectureDiagrams: boolean;
  emailNotifications: boolean;
  taskUpdates: boolean;
}

const SETTINGS_STORAGE_KEY = "app_settings";

export default function Settings() {
  const { toast } = useToast();
  
  const [settings, setSettings] = useState<SettingsState>({
    name: "John Doe",
    email: "john.doe@example.com",
    company: "Acme Inc.",
    autoGenerate: true,
    detailedSpecs: true,
    architectureDiagrams: false,
    emailNotifications: true,
    taskUpdates: true,
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings((prev) => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error("Failed to parse saved settings:", error);
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const handleCancel = () => {
    // Reload settings from localStorage
    const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings((prev) => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error("Failed to parse saved settings:", error);
      }
    }
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
                  value={settings.name}
                  onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                  data-testid="input-name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  data-testid="input-email"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={settings.company}
                  onChange={(e) => setSettings({ ...settings, company: e.target.value })}
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
                  checked={settings.autoGenerate}
                  onCheckedChange={(checked) => setSettings({ ...settings, autoGenerate: checked })}
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
                  checked={settings.detailedSpecs}
                  onCheckedChange={(checked) => setSettings({ ...settings, detailedSpecs: checked })}
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
                  checked={settings.architectureDiagrams}
                  onCheckedChange={(checked) => setSettings({ ...settings, architectureDiagrams: checked })}
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
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
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
                  checked={settings.taskUpdates}
                  onCheckedChange={(checked) => setSettings({ ...settings, taskUpdates: checked })}
                  data-testid="switch-task-updates"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCancel} data-testid="button-cancel">
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
