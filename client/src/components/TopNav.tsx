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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function TopNav() {
  const [, setLocation] = useLocation();

  return (
    <header className="border-b border-border bg-card sticky top-0 z-50 flex-shrink-0">
      <div className="flex items-center gap-4 px-4 h-14">
        <SidebarTrigger data-testid="button-sidebar-toggle" />

        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search issues, projects, people..."
              className="pl-9 bg-background"
              data-testid="input-search"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="default" 
            size="sm"
            onClick={() => setLocation("/new")}
            data-testid="button-create"
          >
            <Plus className="h-4 w-4 mr-1" />
            Create
          </Button>

          <Button variant="ghost" size="icon" data-testid="button-help">
            <HelpCircle className="h-4 w-4" />
          </Button>

          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" data-testid="button-profile">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLocation("/settings")} data-testid="menu-settings">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLocation("/profile")} data-testid="menu-profile">
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem data-testid="menu-signout">
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
