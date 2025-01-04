export interface TaskFormValues {
  title: string;
  description: string;
  status: string;
  due_date: string;
  project_id?: string;
}

export interface TaskData {
  id: string;
  title: string;
  description: string | null;
  status: string;
  due_date: string | null;
}