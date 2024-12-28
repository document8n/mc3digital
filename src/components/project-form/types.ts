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
  };
  onSuccess?: () => void;
}