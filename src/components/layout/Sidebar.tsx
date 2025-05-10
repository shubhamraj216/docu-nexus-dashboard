
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  Upload,
  FileText,
  Search,
  Logs,
  Database,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  
  const routes = [
    { title: "Dashboard", path: "/", icon: Database },
    { title: "Upload Document", path: "/upload", icon: Upload },
    { title: "All Documents", path: "/documents", icon: FileText },
    { title: "Query Documents", path: "/query", icon: Search },
    { title: "Logs", path: "/logs", icon: Logs },
    { title: "Recalculate", path: "/recalculate", icon: Settings },
  ];

  return (
    <SidebarComponent
      className={cn(
        "fixed left-0 top-0 z-20 flex h-full flex-col border-r bg-sidebar transition-all duration-300 ease-in-out md:relative",
        isSidebarOpen ? "w-64" : "w-[70px]"
      )}
    >
      <SidebarHeader className="flex h-16 items-center border-b border-sidebar-border px-4">
        <div className="flex items-center gap-2 text-sidebar-foreground">
          <FileText className="h-6 w-6" />
          <span className={cn("font-semibold", !isSidebarOpen && "hidden")}>
            DocManager
          </span>
        </div>
        <div className="ml-auto">
          <Button
            variant="ghost"
            size="icon"
            className="hidden text-sidebar-foreground md:flex"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {routes.map((route) => (
            <SidebarMenuItem key={route.path}>
              <SidebarMenuButton
                asChild
                className={cn(
                  "flex items-center gap-2 text-sidebar-foreground",
                  location.pathname === route.path && "bg-sidebar-accent"
                )}
              >
                <Link to={route.path}>
                  <route.icon className="h-5 w-5" />
                  <span className={!isSidebarOpen ? "hidden" : ""}>
                    {route.title}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="flex items-center justify-center text-xs text-sidebar-foreground/70">
          {isSidebarOpen ? "DocManager v1.0" : "v1.0"}
        </div>
      </SidebarFooter>
    </SidebarComponent>
  );
};
