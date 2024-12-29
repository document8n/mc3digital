export interface ProjectFormValues {
  name: string;
  start_date: Date;
  due_date?: Date;
  status: string;
  is_active: boolean;
  is_portfolio: boolean;
  notes?: string;
  url?: string;
  image?: string;
  client_id?: string;
  team_members?: string;
}

export interface ProjectFormProps {
  initialData?: {
    id: string;
    name: string;
    start_date: string;
    due_date?: string;
    status: string;
    is_active: boolean;
    is_portfolio: boolean;
    notes?: string;
    url?: string;
    image?: string;
    client_id?: string;
    team_members?: string;
  };
  onSuccess?: () => void;
}