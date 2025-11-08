import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Calendar,
  Mail,
  MapPin,
  Briefcase,
  Link as LinkIcon,
  Share2,
  PencilLine,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

export default function Profile() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [profile, setProfile] = useState({
    name: "John Doe",
    title: "Product Manager & Developer",
    email: "john.doe@example.com",
    company: "Acme Inc.",
    location: "San Francisco, CA",
    joined: "January 2024",
    bio: `Experienced product manager and full-stack developer with a passion for 
building innovative solutions. Specialized in AI-powered applications and 
enterprise software development. Currently focused on project planning and 
architecture tools.`,
  });
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState(profile);

  const { data: reportSummary } = useQuery<{
    totalProjects: number;
    totals: {
      completedTasks: number;
      aiGeneratedTasks?: number;
    };
  }>({
    queryKey: ["/api/reports/summary"],
  });

  const stats = useMemo(
    () => ({
      totalProjects: reportSummary?.totalProjects ?? 0,
      completedTasks: reportSummary?.totals.completedTasks ?? 0,
      aiGenerations: reportSummary?.totals.aiGeneratedTasks ?? 0,
    }),
    [reportSummary]
  );

  useEffect(() => {
    if (isEditOpen) {
      setEditData(profile);
    }
  }, [isEditOpen, profile]);

  const avatarInitials = useMemo(() => {
    const parts = profile.name.trim().split(/\s+/);
    if (!parts.length) return "JD";
    const initials = parts
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("");
    return initials || "JD";
  }, [profile.name]);

  const recentProjects = useMemo(
    () => [
      {
        id: "proj-1",
        key: "VIBE-201",
        name: "AI Workflow Automation",
        summary: "Automating sprint rituals with AI-generated updates.",
        status: "In progress",
        updated: "Updated 2 days ago",
        tags: ["AI", "Automation"],
        projectId: "1",
      },
      {
        id: "proj-2",
        key: "VIBE-186",
        name: "Design System Refresh",
        summary: "Refining UI tokens and themed components for consistency.",
        status: "Review",
        updated: "Updated 5 days ago",
        tags: ["Design", "UI"],
        projectId: "2",
      },
      {
        id: "proj-3",
        key: "VIBE-174",
        name: "Analytics Suite",
        summary: "Launching real-time velocity and burndown reporting.",
        status: "Shipped",
        updated: "Released last week",
        tags: ["Metrics", "Insights"],
        projectId: "3",
      },
    ],
    []
  );

  const recentActivity = useMemo(
    () => [
      {
        id: "activity-1",
        headline: "Closed task VIBE-341",
        context: "Merged AI prompt refinements into main branch.",
        timestamp: "3 hours ago",
      },
      {
        id: "activity-2",
        headline: "Left feedback on PR #128",
        context: "Suggested refactoring for the project timeline widget.",
        timestamp: "Yesterday",
      },
      {
        id: "activity-3",
        headline: "Created sprint plan",
        context: "Defined milestones for the AI Workflow Automation track.",
        timestamp: "2 days ago",
      },
    ],
    []
  );

  const handleEditFieldChange = useCallback(
    (field: keyof typeof profile, value: string) => {
      setEditData((previous) => ({
        ...previous,
        [field]: value,
      }));
    },
    []
  );

  const handleEditSave = useCallback(() => {
    setProfile(editData);
    setIsEditOpen(false);
    toast({
      title: "Profile updated",
      description: "Your profile details have been saved.",
    });
  }, [editData, toast]);

  const handleShareProfile = useCallback(async () => {
    const profileUrl = typeof window !== "undefined" ? window.location.href : "/profile";

    try {
      await navigator.clipboard.writeText(profileUrl);
      toast({
        title: "Profile link copied",
        description: "Share it with your teammates.",
      });
    } catch (error) {
      console.error("Failed to copy profile link", error);
      toast({
        title: "Unable to copy link",
        description: "Copy the URL from your browser address bar instead.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleProjectNavigate = useCallback(
    (projectId: string) => {
      setLocation(`/project/${projectId}`);
    },
    [setLocation]
  );

  return (
    <>
      <div className="h-full overflow-auto">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            <Card data-testid="card-profile-header">
              <CardContent className="pt-6">
                <div className="flex items-start gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarFallback className="text-2xl">
                      {avatarInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-4">
                    <div>
                      <h1 className="text-3xl font-bold">{profile.name}</h1>
                      <p className="text-muted-foreground text-lg mt-1">
                        {profile.title}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span>{profile.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        <span>{profile.company}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{profile.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Joined {profile.joined}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="default"
                        data-testid="button-edit-profile"
                        onClick={() => setIsEditOpen(true)}
                      >
                        <PencilLine className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                      <Button
                        variant="outline"
                        data-testid="button-share-profile"
                        onClick={handleShareProfile}
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview" data-testid="tab-overview">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="projects" data-testid="tab-projects">
                  Projects
                </TabsTrigger>
                <TabsTrigger value="activity" data-testid="tab-activity">
                  Activity
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <Card data-testid="card-stats">
                  <CardHeader>
                    <CardTitle>Statistics</CardTitle>
                    <CardDescription>Your activity summary</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Total Projects
                        </p>
                        <p className="text-3xl font-bold">
                          {stats.totalProjects}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Tasks Completed
                        </p>
                        <p className="text-3xl font-bold">
                          {stats.completedTasks}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          AI Generations
                        </p>
                        <p className="text-3xl font-bold">
                          {stats.aiGenerations}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card data-testid="card-skills">
                  <CardHeader>
                    <CardTitle>Skills & Technologies</CardTitle>
                    <CardDescription>Areas of expertise</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">React</Badge>
                      <Badge variant="secondary">TypeScript</Badge>
                      <Badge variant="secondary">Node.js</Badge>
                      <Badge variant="secondary">PostgreSQL</Badge>
                      <Badge variant="secondary">AI/ML</Badge>
                      <Badge variant="secondary">Cloud Architecture</Badge>
                      <Badge variant="secondary">DevOps</Badge>
                      <Badge variant="secondary">Agile</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card data-testid="card-bio">
                  <CardHeader>
                    <CardTitle>About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {profile.bio}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="projects" className="space-y-4">
                <Card data-testid="card-recent-projects">
                  <CardHeader>
                    <CardTitle>Recent Projects</CardTitle>
                    <CardDescription>
                      Projects you've worked on
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recentProjects.map((project) => (
                      <div
                        key={project.id}
                        className="flex flex-col gap-3 rounded-lg border border-border/60 bg-muted/20 p-4 transition hover:border-border"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              {project.key}
                            </p>
                            <h3 className="text-lg font-semibold">
                              {project.name}
                            </h3>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Badge variant="secondary">{project.status}</Badge>
                            <span>{project.updated}</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {project.summary}
                        </p>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap gap-2">
                            {project.tags.map((tag) => (
                              <Badge
                                key={`${project.id}-${tag}`}
                                variant="outline"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleProjectNavigate(project.projectId)}
                          >
                            Open project
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="space-y-4">
                <Card data-testid="card-recent-activity">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your recent actions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recentActivity.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex flex-col gap-2 rounded-lg border border-border/60 bg-muted/20 p-4"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-medium">{entry.headline}</h3>
                          <span className="text-sm text-muted-foreground">
                            {entry.timestamp}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {entry.context}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Update how your teammates see you across projects.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="profile-name">Full name</Label>
              <Input
                id="profile-name"
                value={editData.name}
                onChange={(event) =>
                  handleEditFieldChange("name", event.target.value)
                }
                data-testid="input-profile-name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="profile-title">Role</Label>
              <Input
                id="profile-title"
                value={editData.title}
                onChange={(event) =>
                  handleEditFieldChange("title", event.target.value)
                }
                data-testid="input-profile-title"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="profile-company">Company</Label>
              <Input
                id="profile-company"
                value={editData.company}
                onChange={(event) =>
                  handleEditFieldChange("company", event.target.value)
                }
                data-testid="input-profile-company"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="profile-location">Location</Label>
              <Input
                id="profile-location"
                value={editData.location}
                onChange={(event) =>
                  handleEditFieldChange("location", event.target.value)
                }
                data-testid="input-profile-location"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="profile-email">Email</Label>
              <Input
                id="profile-email"
                type="email"
                value={editData.email}
                onChange={(event) =>
                  handleEditFieldChange("email", event.target.value)
                }
                data-testid="input-profile-email"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="profile-joined">Joined</Label>
              <Input
                id="profile-joined"
                value={editData.joined}
                onChange={(event) =>
                  handleEditFieldChange("joined", event.target.value)
                }
                data-testid="input-profile-joined"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="profile-bio">Bio</Label>
              <Textarea
                id="profile-bio"
                value={editData.bio}
                onChange={(event) =>
                  handleEditFieldChange("bio", event.target.value)
                }
                data-testid="textarea-profile-bio"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditOpen(false)}
              data-testid="button-edit-cancel"
            >
              Cancel
            </Button>
            <Button onClick={handleEditSave} data-testid="button-edit-save">
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
