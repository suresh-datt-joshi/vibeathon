import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { LayoutDashboard, FolderKanban, BarChart3, Settings } from "lucide-react";
import { useLocation } from "wouter";

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    match: (path: string) => path === "/" || path.startsWith("/dashboard"),
  },
  {
    title: "Projects",
    url: "/projects",
    icon: FolderKanban,
    match: (path: string) => path === "/projects" || path.startsWith("/project/"),
  },
  {
    title: "Reports",
    url: "/reports",
    icon: BarChart3,
    match: (path: string) => path.startsWith("/reports"),
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    match: (path: string) => path.startsWith("/settings"),
  },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.match ? item.match(location) : location === item.url}
                  >
                    <a
                      href={item.url}
                      data-testid={`sidebar-${item.title.toLowerCase()}`}
                      aria-current={
                        item.match ? (item.match(location) ? "page" : undefined) : location === item.url ? "page" : undefined
                      }
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
