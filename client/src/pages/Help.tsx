import Breadcrumbs from "@/components/Breadcrumbs";
import PageContainer from "@/components/PageContainer";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
    BookOpen,
    LifeBuoy,
    Mail,
    MessageCircle,
} from "lucide-react";
import { useCallback } from "react";

const quickLinks = [
    {
        title: "Product Guide",
        description: "Learn how to plan, execute, and track engineering work in Vibeathon.",
        icon: BookOpen,
        href: "https://docs.vibeathon.dev/guide",
        cta: "Read the guide",
    },
    {
        title: "AI Agent Setup",
        description: "Walk through enabling autonomous agents for your workspace.",
        icon: LifeBuoy,
        href: "https://docs.vibeathon.dev/agents",
        cta: "Configure agents",
    },
    {
        title: "API Reference",
        description: "Integrate with Vibeathon using REST and realtime APIs.",
        icon: MessageCircle,
        href: "https://docs.vibeathon.dev/api",
        cta: "Explore the API",
    },
];

export default function Help() {
    const { toast } = useToast();

    const handleContactSupport = useCallback(() => {
        toast({
            title: "Support request sent",
            description: "We’ll reach out within one business day.",
        });
    }, [toast]);

    return (
        <PageContainer className="py-4">
            <div className="border-b border-border bg-card py-4 px-4 sm:px-6 lg:px-8">
                <Breadcrumbs items={[{ label: "Help Center" }]} />
                <div className="mt-3 space-y-2">
                    <h1 className="text-2xl font-semibold">How can we help?</h1>
                    <p className="text-sm text-muted-foreground max-w-2xl">
                        Browse guides, learn best practices, and get in touch with the team. Use the quick links below to jump directly to popular resources.
                    </p>
                </div>
            </div>

            <div className="py-6 space-y-6">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {quickLinks.map((link) => (
                        <Card key={link.title}>
                            <CardHeader className="flex flex-row items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <link.icon className="h-10 w-10 text-primary" />
                                    <div>
                                        <CardTitle className="text-lg">{link.title}</CardTitle>
                                        <CardDescription>{link.description}</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <Button
                                    variant="secondary"
                                    asChild
                                    className="w-full justify-center"
                                    data-testid={`help-link-${link.title.toLowerCase().replace(/\s+/g, "-")}`}
                                >
                                    <a href={link.href} target="_blank" rel="noreferrer">
                                        {link.cta}
                                    </a>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Need something else?</CardTitle>
                        <CardDescription>
                            Our support team is ready to assist with troubleshooting, onboarding, and custom integrations.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-sm text-muted-foreground">
                            Email us at{" "}
                            <a
                                href="mailto:support@vibeathon.dev"
                                className="font-medium text-primary underline-offset-4 hover:underline"
                            >
                                support@vibeathon.dev
                            </a>{" "}
                            or send a quick ping below. We usually respond within 24 hours.
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" asChild>
                                <a href="mailto:support@vibeathon.dev" data-testid="help-email-support">
                                    <Mail className="h-4 w-4 mr-2" />
                                    Email support
                                </a>
                            </Button>
                            <Button onClick={handleContactSupport} data-testid="help-request-callback">
                                Request a callback
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </PageContainer>
    );
}

