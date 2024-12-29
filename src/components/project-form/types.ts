export interface ProjectFormValues {
  name: string;
  start_date: Date;
  status: string;
  team_size: number;
  budget: number;
  is_active: boolean;
  is_portfolio: boolean;
  notes?: string;
  url?: string;
  image?: string;
  client_id?: string;
  industry?: string;
}

export interface ProjectFormProps {
  initialData?: {
    id: string;
    name: string;
    start_date: string;
    status: string;
    team_size: number;
    budget: number;
    is_active: boolean;
    is_portfolio: boolean;
    notes?: string;
    url?: string;
    image?: string;
    client_id?: string;
    industry?: string;
  };
  onSuccess?: () => void;
}