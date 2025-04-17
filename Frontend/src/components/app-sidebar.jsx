import { Home, User, Map, Ship } from "lucide-react";

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

// Define the main menu items
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Map",
    url: "/map",
    icon: Map,
  },
  {
    title: "Ships",
    url: "/ships",
    icon: Ship,
  },
  {
    title: "Account",
    url: "/account",
    icon: User,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg font-semibold mx-4 my-2">Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className={"mx-4 my-2"}>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href={item.url} className="flex items-center gap-3 text-lg group transition-transform duration-200 hover:scale-110">
                    <item.icon
                      className="w-12 h-12 "
                      strokeWidth={2}
                    />
                    <span className="text-lg font-small">{item.title}</span>
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
