import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

interface PortfolioProject {
  id: string;
  name: string;
  image: string;
  url: string;
  industry: string;
}

export const Portfolio = () => {
  const [portfolioProjects, setPortfolioProjects] = useState<PortfolioProject[]>([]);
  const { toast } = useToast();
  
  const autoplayPlugin = Autoplay({
    delay: 4600, // Increased by 15% from 4000ms
    stopOnInteraction: false,
    jump: false,
    playOnInit: true,
  });

  useEffect(() => {
    const fetchPortfolioProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('id, name, image, url, industry')
          .eq('is_portfolio', true)
          .eq('is_active', true)
          .order('display_order', { ascending: true });

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

        <Carousel
          opts={{
            align: "start",
            loop: true,
            dragFree: true,
            slidesToScroll: 1,
            skipSnaps: false,
          }}
          plugins={[autoplayPlugin]}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {portfolioProjects.map((project, index) => (
              <CarouselItem key={project.id} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="h-full"
                >
                  <Card className="overflow-hidden group hover:scale-105 transition-transform duration-300 h-full flex flex-col bg-[#FFFFFF] shadow-xl border-white/20">
                    <div className="relative h-48 flex items-center justify-center bg-[#FFFFFF] p-6">
                      <img
                        src={project.image || '/placeholder.svg'}
                        alt={project.name}
                        className="w-full h-full object-contain max-h-40"
                      />
                    </div>
                    <CardContent className="p-6 flex flex-col gap-3 bg-[#FFFFFF]">
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-semibold text-gray-800">{project.name}</h3>
                        {project.industry && (
                          <Badge variant="secondary" className="ml-2">
                            {project.industry}
                          </Badge>
                        )}
                      </div>
                      {project.url && (
                        <Link 
                          to={project.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors mt-auto font-medium group"
                        >
                          View Project 
                          <ExternalLink className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
};