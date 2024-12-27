import AdminMenu from "@/components/AdminMenu";

const Projects = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <AdminMenu />
      <div className="pl-64">
        <div className="p-6 max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-6">Projects</h1>
          <div className="bg-card rounded-lg p-6">
            <p className="text-muted-foreground">Projects dashboard coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;