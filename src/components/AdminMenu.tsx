import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Grid, FileText, User, Settings, Code2, ArrowLeft, LogOut, Menu, X, Home } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const menuItems = [
  { icon: Home, label: "Home", path: "/admin" },
  { icon: Grid, label: "Projects", path: "/projects" },
  { icon: FileText, label: "Invoices", path: "/invoice" },
  { icon: User, label: "Clients", path: "/clients" },
  { icon: Settings, label: "Services", path: "/services" },
];

const AdminMenu = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(!isMobile);
  
  console.log("Current location:", location.pathname);

  const handleLogout = async () => {
    console.log("Logging out...");
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error);
      toast({
        title: "Error",
        description: "There was a problem logging out",
        variant: "destructive",
      });
      return;
    }
    navigate('/');
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
    });
  };

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed z-50 p-2 transition-all duration-300 rounded-md bg-sidebar",
          isMobile ? "top-4 left-4" : "hidden"
        )}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <Menu className="h-6 w-6 text-white" />
        )}
      </button>

      {/* Sidebar */}
      <nav className={cn(
        "bg-sidebar border-r border-sidebar-border fixed left-0 top-0 h-screen p-4 flex flex-col transition-all duration-300 ease-in-out z-40",
        isMobile ? (isOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0",
        isMobile ? "w-[80%] max-w-[300px]" : "w-64"
      )}>
        {/* Logo and Site Name */}
        <div className="flex items-center space-x-2 mb-8">
          <Code2 className="h-6 w-6 text-white" />
          <span className="text-xl font-bold text-white">mc3digital</span>
        </div>

        {/* Menu Items */}
        <div className="space-y-2 flex-grow">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => isMobile && setIsOpen(false)}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-md transition-colors text-white",
                  "hover:bg-sidebar-accent hover:text-orange-400",
                  isActive ? "bg-blue-600 text-white font-medium" : "text-white"
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 px-3 py-2 mb-2 text-white hover:text-orange-400 transition-colors rounded-md hover:bg-sidebar-accent"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>

        {/* Back to Site Link */}
        <Link
          to="/"
          className="flex items-center space-x-2 px-3 py-2 text-white hover:text-orange-400 transition-colors rounded-md hover:bg-sidebar-accent"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Site</span>
        </Link>
      </nav>

      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default AdminMenu;