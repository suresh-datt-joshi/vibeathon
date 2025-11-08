import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Mail, MapPin, Briefcase, Link as LinkIcon } from "lucide-react";

export default function Profile() {
  return (
    <div className="h-full overflow-auto">
      <div className="container max-w-5xl py-8 px-4">
        <div className="space-y-6">
          <Card data-testid="card-profile-header">
            <CardContent className="pt-6">
              <div className="flex items-start gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="text-2xl">JD</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-4">
                  <div>
                    <h1 className="text-3xl font-bold">John Doe</h1>
                    <p className="text-muted-foreground text-lg mt-1">
                      Product Manager & Developer
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>john.doe@example.com</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      <span>Acme Inc.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>San Francisco, CA</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Joined January 2024</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="default" data-testid="button-edit-profile">
                      Edit Profile
                    </Button>
                    <Button variant="outline" data-testid="button-share-profile">
                      <LinkIcon className="h-4 w-4 mr-2" />
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
                      <p className="text-sm text-muted-foreground">Total Projects</p>
                      <p className="text-3xl font-bold">12</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Tasks Completed</p>
                      <p className="text-3xl font-bold">247</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">AI Generations</p>
                      <p className="text-3xl font-bold">34</p>
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
                  <p className="text-muted-foreground leading-relaxed">
                    Experienced product manager and full-stack developer with a passion for 
                    building innovative solutions. Specialized in AI-powered applications and 
                    enterprise software development. Currently focused on project planning and 
                    architecture tools.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects" className="space-y-4">
              <Card data-testid="card-recent-projects">
                <CardHeader>
                  <CardTitle>Recent Projects</CardTitle>
                  <CardDescription>Projects you've worked on</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center py-8">
                    Your recent projects will appear here
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <Card data-testid="card-recent-activity">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your recent actions</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center py-8">
                    Your recent activity will appear here
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
