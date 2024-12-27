import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useEffect } from "react";

declare global {
  interface Window {
    particlesJS: any;
  }
}

export const Hero = () => {
  useEffect(() => {
    if (typeof window.particlesJS !== 'undefined') {
      window.particlesJS('particles-js', {
        particles: {
          number: {
            value: 80,
            density: {
              enable: true,
              value_area: 800
            }
          },
          color: {
            value: "#ffffff"
          },
          shape: {
            type: "circle",
          },
          opacity: {
            value: 0.5,
            random: false,
          },
          size: {
            value: 3,
            random: true,
          },
          line_linked: {
            enable: true,
            distance: 150,
            color: "#ffffff",
            opacity: 0.4,
            width: 1
          },
          move: {
            enable: true,
            speed: 6,
            direction: "none",
            random: false,
            straight: false,
            out_mode: "out",
            bounce: false,
          }
        },
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: {
              enable: true,
              mode: "repulse"
            },
            resize: true
          },
          modes: {
            repulse: {
              distance: 100,
              duration: 0.4
            }
          }
        },
        retina_detect: true
      });
    }
  }, []);

  return (
    <section className="min-h-screen flex flex-col justify-center items-center relative section-padding overflow-hidden bg-gradient-to-br from-[#1A1F2C] via-[#2C1F3D] to-[#1E293B]">
      <div id="particles-js" className="absolute inset-0 z-0" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-4xl mx-auto relative z-10"
      >
        <span className="inline-block px-3 py-1 text-sm font-medium bg-white/10 backdrop-blur-sm rounded-full mb-4">
          Welcome to mc3digital
        </span>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gradient">
          Seamless Technology Integration
        </h1>
        <p className="text-lg md:text-xl text-gray-200 mb-8">
          We build, launch, and support web and mobile apps with a proven track record of success.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3 bg-white/10 backdrop-blur-sm text-white rounded-lg font-medium hover-lift border border-white/20"
        >
          Get Started
        </motion.button>
      </motion.div>
      
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 z-10"
      >
        <ChevronDown className="w-6 h-6 text-white/70" />
      </motion.div>
    </section>
  );
};