import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import ThemeToggle from "@/components/ThemeToggle";
import { Search, Plus, Settings, HelpCircle } from "lucide-react";
import { useLocation } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

export default function TopNav() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleSignOut = useCallback(() => {
    toast({
      title: "Signed out",
      description: "You have been signed out of your session.",
    });

    setLocation("/");
  }, [setLocation, toast]);

  return (
    <header className="border-b border-border bg-card sticky top-0 z-50 flex-shrink-0 w-full">
      <div className="flex items-center gap-4 h-14 w-full max-w-6xl mx-auto px-4">
        <SidebarTrigger data-testid="button-sidebar-toggle" />

        <div className="flex-1 max-w-xl ml-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search issues, projects, people..."
              className="pl-9 bg-background"
              data-testid="input-search"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <Button
            variant="default"
            size="sm"
            onClick={() => setLocation("/new")}
            data-testid="button-create"
          >
            <Plus className="h-4 w-4 mr-1" />
            Create
          </Button>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                data-testid="button-help"
                aria-label="Open help center"
                onClick={() => setLocation("/help")}
              >
                <HelpCircle className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent sideOffset={6}>
              Visit the help center
            </TooltipContent>
          </Tooltip>

          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" data-testid="button-profile">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={8}>
              <DropdownMenuLabel>Account</DropdownMenuLabel>
              <DropdownMenuItem
                onSelect={() => setLocation("/settings")}
                data-testid="menu-settings"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => setLocation("/profile")}
                data-testid="menu-profile"
              >
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                data-testid="menu-signout"
                onSelect={(event) => {
                  event.preventDefault();
                  handleSignOut();
                }}
              >
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
