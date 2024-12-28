import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { MenuItems } from "./admin/MenuItems";
import { UserActions } from "./admin/UserActions";

const AdminMenu = () => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(!isMobile);

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed z-50 p-2 transition-all duration-300 rounded-md bg-sidebar text-white",
          isMobile ? "top-4 left-4" : "hidden"
        )}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {/* Sidebar/Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay for mobile */}
            {isMobile && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 z-30"
                onClick={() => setIsOpen(false)}
              />
            )}

            {/* Menu Content */}
            <motion.nav
              initial={isMobile ? { x: "-100%" } : { x: 0 }}
              animate={{ x: 0 }}
              exit={isMobile ? { x: "-100%" } : { x: 0 }}
              transition={{ type: "tween", duration: 0.2 }}
              className={cn(
                "bg-sidebar border-r border-sidebar-border fixed left-0 top-0 h-screen p-4 flex flex-col z-40",
                isMobile ? "w-[80%] max-w-[300px]" : "w-64"
              )}
            >
              {/* Logo */}
              <div className="flex items-center space-x-2 mb-8">
                <Code2 className="h-6 w-6 text-white" />
                <span className="text-xl font-bold text-white">mc3digital</span>
              </div>

              {/* Menu Items */}
              <MenuItems onItemClick={() => isMobile && setIsOpen(false)} />

              {/* User Actions */}
              <UserActions onActionClick={() => isMobile && setIsOpen(false)} />
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminMenu;