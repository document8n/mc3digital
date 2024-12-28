import { ProjectForm } from "@/components/ProjectForm";
import AdminMenu from "@/components/AdminMenu";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export default function AddProject() {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <AdminMenu />
      <div className={cn(
        "transition-all duration-300",
        isMobile ? "pt-16" : "pl-64"
      )}>
        <div className="p-4 md:p-6 max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-6">Create New Project</h1>
          <div className="bg-card p-4 md:p-6 rounded-lg shadow-lg">
            <ProjectForm />
          </div>
        </div>
      </div>
    </div>
  );
}