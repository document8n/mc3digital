import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export const Hero = () => {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center relative section-padding overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <spline-viewer url="https://prod.spline.design/thDEF6-zr9WiHgdi/scene.splinecode" />
      </div>
      
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