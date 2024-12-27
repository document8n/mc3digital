import { Menu, X, Code2 } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed w-full top-0 z-50 bg-[#1A1F2C]/95 backdrop-blur-sm border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Site Name */}
          <Link to="/" className="flex items-center space-x-2 text-white">
            <Code2 className="h-6 w-6" />
            <span className="text-xl font-bold">mc3digital</span>
          </Link>

          {/* Menu Toggle Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white hover:text-gray-300 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Collapsible Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <nav className="py-4 space-y-4">
                <a
                  href="#contact"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-white hover:text-gray-300 transition-colors"
                >
                  Contact Us
                </a>
                <a
                  href="https://portal.mc3digital.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-white hover:text-gray-300 transition-colors"
                >
                  Customer Portal
                </a>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};