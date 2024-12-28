export interface Project {
  id: string;
  name: string;
  start_date: string;
  status: string;
  team_size: number;
  budget: number;
  is_active: boolean;
  is_portfolio: boolean;
  display_order: number;
  user_id: string;
}