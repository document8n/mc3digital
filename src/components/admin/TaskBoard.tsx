import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskCard } from "@/components/tasks/TaskCard";
import { XSquare, PlusSquare, CheckSquare } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  due_date: string | null;
  project?: {
    name: string;
  } | null;
}

interface TaskBoardProps {
  tasks: Task[];
  onUpdate: () => void;
}

export function TaskBoard({ tasks, onUpdate }: TaskBoardProps) {
  const tasksByStatus = {
    todo: tasks?.filter((task) => task.status === "Todo") || [],
    inProgress: tasks?.filter((task) => task.status === "In Progress") || [],
    completed: tasks?.filter((task) => task.status === "Completed") || [],
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="space-y-4">
        <Card className="bg-background/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <XSquare className="h-4 w-4 text-yellow-500" />
              Todo
              <span className="text-muted-foreground">({tasksByStatus.todo.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {tasksByStatus.todo.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onUpdate={onUpdate}
                showProject={true}
              />
            ))}
            {tasksByStatus.todo.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                No tasks to do
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Card className="bg-background/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <PlusSquare className="h-4 w-4 text-blue-500" />
              In Progress
              <span className="text-muted-foreground">({tasksByStatus.inProgress.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {tasksByStatus.inProgress.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onUpdate={onUpdate}
                showProject={true}
              />
            ))}
            {tasksByStatus.inProgress.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                No tasks in progress
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Card className="bg-background/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckSquare className="h-4 w-4 text-green-500" />
              Completed
              <span className="text-muted-foreground">({tasksByStatus.completed.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {tasksByStatus.completed.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onUpdate={onUpdate}
                showProject={true}
              />
            ))}
            {tasksByStatus.completed.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                No completed tasks
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}