
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
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
  CircleEllipsis,
  Workflow,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const [ragExpanded, setRagExpanded] = useState(true);

  const isActive = (path: string) => location.pathname === path;
  const isRagActive = [
    "/upload",
    "/documents",
    "/query",
    "/logs",
    "/recalculate",
  ].includes(location.pathname);

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
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={cn(
                "flex items-center gap-2 text-sidebar-foreground",
                location.pathname === "/" && "bg-sidebar-accent"
              )}
            >
              <Link to="/">
                <Database className="h-5 w-5" />
                <span className={!isSidebarOpen ? "hidden" : ""}>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          {/* RAG Section */}
          <SidebarMenuItem>
            <SidebarMenuButton
              className={cn(
                "flex items-center gap-2 text-sidebar-foreground",
                isRagActive && "bg-sidebar-accent"
              )}
              onClick={() => setRagExpanded(!ragExpanded)}
            >
              <Workflow className="h-5 w-5" />
              <span className={!isSidebarOpen ? "hidden" : ""}>RAG</span>
              {isSidebarOpen && (
                <ChevronRight
                  className={cn(
                    "ml-auto h-4 w-4 transition-transform",
                    ragExpanded && "rotate-90"
                  )}
                />
              )}
            </SidebarMenuButton>
            {ragExpanded && isSidebarOpen && (
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton
                    asChild
                    isActive={isActive("/upload")}
                  >
                    <Link to="/upload">
                      <Upload className="h-4 w-4" />
                      <span>Upload Document</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton
                    asChild
                    isActive={isActive("/documents")}
                  >
                    <Link to="/documents">
                      <FileText className="h-4 w-4" />
                      <span>All Documents</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton
                    asChild
                    isActive={isActive("/query")}
                  >
                    <Link to="/query">
                      <Search className="h-4 w-4" />
                      <span>Query Documents</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton
                    asChild
                    isActive={isActive("/logs")}
                  >
                    <Link to="/logs">
                      <Logs className="h-4 w-4" />
                      <span>Logs</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton
                    asChild
                    isActive={isActive("/recalculate")}
                  >
                    <Link to="/recalculate">
                      <Settings className="h-4 w-4" />
                      <span>Recalculate</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            )}
          </SidebarMenuItem>
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
