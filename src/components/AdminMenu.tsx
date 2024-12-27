import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Grid, FileText, User, Settings } from "lucide-react";

const menuItems = [
  { icon: Grid, label: "Projects", path: "/projects" },
  { icon: FileText, label: "Invoices", path: "/admin" },
  { icon: User, label: "Clients", path: "/clients" },
  { icon: Settings, label: "Services", path: "/services" },
];

const AdminMenu = () => {
  const location = useLocation();
  console.log("Current location:", location.pathname);

  return (
    <nav className="bg-sidebar border-r border-sidebar-border h-screen w-64 fixed left-0 top-0 p-4">
      <div className="space-y-2">
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
    </nav>
  );
};

export default AdminMenu;