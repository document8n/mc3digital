import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { MenuItems } from "./admin/MenuItems";
import { UserActions } from "./admin/UserActions";

const AdminMenu = () => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(!isMobile);

  const handleClose = () => {
    if (isMobile) {
      console.log("Closing mobile menu");
      setIsOpen(false);
    }
  };

  return (
    <header className="fixed w-full top-0 z-50 bg-[#1A1F2C]/95 backdrop-blur-sm border-b border-gray-800">
      {/* Mobile Header */}
      {isMobile && (
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Code2 className="h-6 w-6 text-white" />
              <span className="text-xl font-bold text-white">mc3digital</span>
            </div>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-gray-300 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <motion.nav
          initial={false}
          animate={{ x: isOpen ? 0 : -320 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
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

      {/* Mobile Menu */}
      <AnimatePresence mode="wait">
        {isMobile && isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={handleClose}
            />
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed top-16 left-0 right-0 bg-[#1A1F2C]/95 backdrop-blur-sm z-40 border-b border-gray-800 overflow-hidden"
            >
              <div className="container mx-auto px-4 py-4">
                <MenuItems onItemClick={handleClose} />
                <UserActions onActionClick={handleClose} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default AdminMenu;