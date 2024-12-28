import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PortfolioProject {
  id: string;
  name: string;
  image: string;
  url: string;
}

export const Portfolio = () => {
  const [portfolioProjects, setPortfolioProjects] = useState<PortfolioProject[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPortfolioProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('id, name, image, url')
          .eq('is_portfolio', true)
          .eq('is_active', true);

        if (error) throw error;
        setPortfolioProjects(data || []);
      } catch (error: any) {
        console.error('Error fetching portfolio projects:', error);
        toast({
          title: "Error",
          description: "Failed to load portfolio projects",
          variant: "destructive",
        });
      }
    };

    fetchPortfolioProjects();
  }, [toast]);

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
          {portfolioProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="h-full"
            >
              <Card className="glass-card overflow-hidden group hover:scale-105 transition-transform duration-300 h-full flex flex-col">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={project.image || '/placeholder.svg'}
                    alt={project.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <CardContent className="p-6 flex flex-col">
                  <h3 className="text-xl font-semibold text-white mb-2">{project.name}</h3>
                  {project.url && (
                    <Link 
                      to={project.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 transition-colors mt-auto"
                    >
                      View Project →
                    </Link>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};