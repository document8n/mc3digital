import { motion } from "framer-motion";

const services = [
  { title: "Outsourced CTO", description: "Strategic technology leadership and guidance" },
  { title: "Tech Stack Administration", description: "Comprehensive technology infrastructure management" },
  { title: "Application QA", description: "Thorough quality assurance and testing" },
  { title: "Frontend Development", description: "Creating engaging user interfaces" },
  { title: "Backend Development", description: "Robust server-side solutions" },
  { title: "Custom Applications", description: "Tailored software solutions" },
];

export const Services = () => {
  return (
    <section className="section-padding bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 text-sm font-medium bg-gray-100 rounded-full mb-4">
            Our Services
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Comprehensive Digital Solutions
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            From strategy to execution, we provide end-to-end digital services
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="glass-card p-6 rounded-xl hover-lift"
            >
              <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};