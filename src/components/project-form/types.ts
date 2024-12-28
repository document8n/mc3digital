export interface ProjectFormValues {
  name: string;
  client: string;
  start_date: Date;
  status: string;
  team_size: number;
  budget: number;
  is_active: boolean;
  is_public: boolean;
  notes?: string;
}

export interface ProjectFormProps {
  initialData?: {
    id: string;
    name: string;
    client: string;
    start_date: string;
    status: string;
    team_size: number;
    budget: number;
    is_active: boolean;
    is_public: boolean;
    notes?: string;
  };
  onSuccess?: () => void;
}