import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { XSquare, PlusSquare, CheckSquare } from "lucide-react";

interface TasksByStatus {
  todo: any[];
  inProgress: any[];
  completed: any[];
}

interface TaskStatsProps {
  tasksByStatus: TasksByStatus;
}

export function TaskStats({ tasksByStatus }: TaskStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
          <XSquare className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{tasksByStatus.todo.length}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          <PlusSquare className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{tasksByStatus.inProgress.length}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Completed</CardTitle>
          <CheckSquare className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{tasksByStatus.completed.length}</div>
        </CardContent>
      </Card>
    </div>
  );
}