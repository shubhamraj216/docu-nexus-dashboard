
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface NavbarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Navbar = ({ isSidebarOpen, setIsSidebarOpen }: NavbarProps) => {
  return (
    <header className="border-b bg-card">
      <div className="flex h-16 items-center px-4 md:px-6">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 md:hidden"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
        <div className="ml-auto flex items-center space-x-4">
          <div className="text-sm font-medium">Bot Dashboard</div>
        </div>
      </div>
    </header>
  );
};
