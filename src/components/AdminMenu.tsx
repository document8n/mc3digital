import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Grid, FileText, User, Settings, Code2, ArrowLeft, LogOut } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const menuItems = [
  { icon: Grid, label: "Projects", path: "/projects" },
  { icon: FileText, label: "Invoices", path: "/admin" },
  { icon: User, label: "Clients", path: "/clients" },
  { icon: Settings, label: "Services", path: "/services" },
];

const AdminMenu = () => {
  const location = useLocation();
  const navigate = useNavigate();
  console.log("Current location:", location.pathname);

  const handleLogout = () => {
    console.log("Logging out...");
    navigate('/');
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
    });
  };

  return (
    <nav className="bg-sidebar border-r border-sidebar-border h-screen w-64 fixed left-0 top-0 p-4 flex flex-col">
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
          console.log(`Menu item ${item.label} active:`, isActive);
          
          return (
            <Link
              key={item.path}
              to={item.path}
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
  );
};

export default AdminMenu;