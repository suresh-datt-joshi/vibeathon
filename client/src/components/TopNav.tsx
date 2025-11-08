import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ThemeToggle from "@/components/ThemeToggle";
import { Search, Plus, Settings, HelpCircle, Sparkles } from "lucide-react";
import { useLocation } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function TopNav() {
  const [location, setLocation] = useLocation();

  return (
    <header className="border-b border-border bg-card sticky top-0 z-50">
      <div className="flex items-center gap-4 px-4 h-14">
        <button 
          onClick={() => setLocation("/")} 
          className="flex items-center gap-2 font-bold text-lg hover-elevate px-2 py-1 rounded-md"
          data-testid="button-home"
        >
          <Sparkles className="h-5 w-5 text-primary" />
          Aurora Ops
        </button>

        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
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
                  <AvatarFallback className="text-xs">AU</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
