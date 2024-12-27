import AdminMenu from "@/components/AdminMenu";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code2, Database, Globe2, Layout, Server, Smartphone, Briefcase, Wrench, Shield, Gauge, Boxes, Clock } from "lucide-react";

const serviceCategories = [
  {
    title: "Strategic Leadership",
    items: [
      {
        icon: Briefcase,
        name: "Outsourced CTO Leadership",
        description: "Strategic technology planning, architecture decisions, vendor selection, security oversight, budget management, and technology roadmap development",
        pricing: "Monthly retainer starting at $12,000"
      },
      {
        icon: Server,
        name: "Technology Stack Administration",
        description: "System architecture maintenance, performance optimization, security updates, and infrastructure scaling",
        pricing: "Monthly retainer starting at $8,000"
      }
    ]
  },
  {
    title: "Development Services",
    items: [
      {
        icon: Code2,
        name: "Custom Application Development",
        description: "Full-cycle development from requirements to deployment",
        pricing: "Projects starting at $25,000\nHourly rate: $150-250"
      },
      {
        icon: Globe2,
        name: "Web & Mobile Development",
        description: "Responsive web applications, native/hybrid mobile apps, progressive web apps",
        pricing: "Projects starting at $15,000\nHourly rate: $125-200"
      },
      {
        icon: Database,
        name: "API Integration Services",
        description: "Third-party API integration, middleware development, API optimization",
        pricing: "Per integration starting at $5,000\nHourly rate: $150-200"
      }
    ]
  },
  {
    title: "User Experience & Design",
    items: [
      {
        icon: Layout,
        name: "UX/UI Design & Implementation",
        description: "User research, wireframing, prototyping, UI design, usability testing",
        pricing: "Projects starting at $10,000\nHourly rate: $125-175"
      },
      {
        icon: Smartphone,
        name: "Customer Experience (CX) Refinement",
        description: "Customer journey mapping, touchpoint optimization, analytics implementation",
        pricing: "Projects starting at $8,000\nMonthly retainer: $4,000"
      }
    ]
  },
  {
    title: "Quality & Operations",
    items: [
      {
        icon: Shield,
        name: "Application QA & Testing",
        description: "Test planning, automated testing, performance testing, security testing",
        pricing: "Monthly retainer starting at $6,000\nPer-project testing: $5,000+"
      },
      {
        icon: Wrench,
        name: "DevOps & Deployment",
        description: "CI/CD pipeline setup, infrastructure automation, monitoring implementation",
        pricing: "Setup projects starting at $10,000\nMonthly maintenance: $4,000+"
      }
    ]
  },
  {
    title: "Specialized Solutions",
    items: [
      {
        icon: Boxes,
        name: "No-Code Development",
        description: "Platform selection, workflow automation, integration setup",
        pricing: "Projects starting at $8,000\nHourly rate: $100-150"
      },
      {
        icon: Gauge,
        name: "App Prototyping",
        description: "Rapid prototyping, MVP development, proof of concept",
        pricing: "Projects starting at $15,000\n2-week sprint: $10,000"
      }
    ]
  },
  {
    title: "Support & Maintenance",
    items: [
      {
        icon: Clock,
        name: "Ongoing Technical Support",
        description: "Bug fixes, performance optimization, security patches",
        pricing: "Monthly retainer starting at $5,000\nHourly rate: $125-175"
      },
      {
        icon: Database,
        name: "System Upgrades & Migrations",
        description: "Version upgrades, platform migrations, data transfer",
        pricing: "Projects starting at $20,000\nHourly rate: $150-200"
      }
    ]
  }
];

const Services = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <AdminMenu />
      <div className="pl-64">
        <div className="p-6 max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">Services & Pricing</h1>
            <p className="text-gray-300">
              Comprehensive digital solutions tailored to your business needs. All prices are starting points and may vary based on project complexity, timeline requirements, and specific needs.
            </p>
          </div>

          <div className="space-y-12">
            {serviceCategories.map((category, index) => (
              <div key={index} className="space-y-6">
                <h2 className="text-2xl font-semibold text-white border-b border-gray-700 pb-2">
                  {category.title}
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {category.items.map((service, serviceIndex) => {
                    const Icon = service.icon;
                    return (
                      <Card 
                        key={serviceIndex}
                        className="hover:scale-105 transition-transform duration-200 bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700"
                      >
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                              <Icon className="h-6 w-6" />
                            </div>
                            <CardTitle className="text-xl text-white">{service.name}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <CardDescription className="text-gray-400">
                            {service.description}
                          </CardDescription>
                          <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                            <p className="text-sm font-medium text-gray-300 whitespace-pre-line">
                              {service.pricing}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 rounded-lg bg-gray-800/50 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-3">Note:</h3>
            <p className="text-gray-300">
              All prices are suggested starting points and may vary based on:
            </p>
            <ul className="list-disc list-inside text-gray-400 mt-2 space-y-1">
              <li>Project complexity and scope</li>
              <li>Timeline requirements</li>
              <li>Industry-specific compliance needs</li>
              <li>Integration requirements</li>
              <li>Team size and resource allocation</li>
              <li>Geographic location of service delivery</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;