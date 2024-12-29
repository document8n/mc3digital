export interface Project {
  id: string;
  name: string;
  start_date: string;
  due_date?: string;
  status: string;
  is_active: boolean;
  is_portfolio: boolean;
  display_order: number;
  user_id: string;
  client_id?: string;
  notes?: string;
  url?: string;
  image?: string;
  team_members?: string;
  created_at?: string;
  updated_at?: string;
}