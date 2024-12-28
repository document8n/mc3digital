export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  due_date: string | null;
  display_order: number;
  project?: {
    name: string;
  } | null;
}