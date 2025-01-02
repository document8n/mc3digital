import { useState } from "react";
import AdminMenu from "@/components/AdminMenu";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { TaskHeader } from "@/components/tasks/TaskHeader";
import { TaskList } from "@/components/tasks/TaskList";

const Tasks = () => {
  const isMobile = useIsMobile();
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);

  const handleTaskSuccess = () => {
    setIsTaskFormOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <AdminMenu />
      <div className={cn(
        "transition-all duration-300",
        isMobile ? "pl-0" : "pl-64"
      )}>
        <div className="dashboard-container space-y-6">
          <TaskHeader
            title="Task Management"
            isFormOpen={isTaskFormOpen}
            onFormOpenChange={setIsTaskFormOpen}
            onTaskSuccess={handleTaskSuccess}
          />
          <TaskList onUpdate={handleTaskSuccess} />
        </div>
      </div>
    </div>
  );
};

export default Tasks;