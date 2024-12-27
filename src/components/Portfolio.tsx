import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Gallery, Award, Trophy } from "lucide-react";

const portfolioItems = [
  {
    title: "Web Development",
    description: "Custom web applications built with modern technologies",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    icon: Gallery
  },
  {
    title: "Enterprise Solutions",
    description: "Scalable solutions for growing businesses",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    icon: Award
  },
  {
    title: "Mobile Applications",
    description: "Cross-platform mobile apps for iOS and Android",
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    icon: Trophy
  }
];

export const Portfolio = () => {
  return (
    <section className="section-padding bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Portfolio</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Discover our successful projects and see how we've helped businesses achieve their digital goals.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolioItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="glass-card overflow-hidden group hover:scale-105 transition-transform duration-300">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <item.icon className="w-12 h-12 text-white opacity-75" />
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-300">{item.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};