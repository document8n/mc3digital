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

  const handleClose = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Header */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 h-16 bg-[#1A1F2C] shadow-lg z-50 px-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Code2 className="h-6 w-6 text-white" />
            <span className="text-xl font-bold text-white">mc3digital</span>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-white hover:text-gray-300 transition-colors"
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      )}

      {/* Desktop Menu Toggle */}
      {!isMobile && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed z-50 p-2 transition-all duration-300 rounded-md bg-sidebar text-white hidden"
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      )}

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
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={handleClose}
              />
            )}

            {/* Menu Content */}
            {isMobile ? (
              <motion.nav
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed top-16 left-0 right-0 bg-[#1A1F2C]/95 backdrop-blur-sm overflow-hidden z-40 border-b border-gray-800"
              >
                <div className="p-4">
                  <MenuItems onItemClick={handleClose} />
                  <UserActions onActionClick={handleClose} />
                </div>
              </motion.nav>
            ) : (
              <motion.nav
                initial={{ x: 0 }}
                animate={{ x: 0 }}
                exit={{ x: 0 }}
                className="sidebar-gradient border-r border-sidebar-border fixed left-0 top-0 h-screen w-64 p-4 flex flex-col z-40"
              >
                <div className="flex items-center space-x-2 mb-8">
                  <Code2 className="h-6 w-6 text-white" />
                  <span className="text-xl font-bold text-white">mc3digital</span>
                </div>
                <MenuItems onItemClick={handleClose} />
                <UserActions onActionClick={handleClose} />
              </motion.nav>
            )}
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminMenu;