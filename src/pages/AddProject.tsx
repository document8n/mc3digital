import { ProjectForm } from "@/components/ProjectForm";
import AdminMenu from "@/components/AdminMenu";

export default function AddProject() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <AdminMenu />
      <div className="pl-64">
        <div className="p-6 max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-6">Create New Project</h1>
          <div className="bg-card p-6 rounded-lg shadow-lg">
            <ProjectForm />
          </div>
        </div>
      </div>
    </div>
  );
}