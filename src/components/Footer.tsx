import { Linkedin } from "lucide-react";
import { Button } from "./ui/button";

export const Footer = () => {
  return (
    <footer className="w-full bg-gray-900 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-blue-400"
              asChild
            >
              <a
                href="https://www.linkedin.com/in/michael-cruden/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-6 w-6" />
              </a>
            </Button>
          </div>
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} MC3 Digital. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};