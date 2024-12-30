import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Grid, FileText, User, Settings, Home, ListTodo, Users } from "lucide-react";

const menuItems = [
  { icon: Home, label: "Dashboard", path: "/admin" },
  { icon: Grid, label: "Projects", path: "/projects" },
  { icon: ListTodo, label: "Tasks", path: "/tasks" },
  { icon: FileText, label: "Invoices", path: "/invoice" },
  { icon: User, label: "Clients", path: "/clients" },
  { icon: Settings, label: "Services", path: "/services" },
  { icon: Users, label: "Users", path: "/users" },
];

export const MenuItems = ({ onItemClick }: { onItemClick?: () => void }) => {
  const location = useLocation();
  
  return (
    <div className="space-y-2 flex-grow">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        
        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={onItemClick}
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
  );
};