export interface ResourceLink {
  url: string;
  title: string;
  tags?: string[];
  [key: string]: string | number | boolean | null | string[] | undefined;
}

export interface Project {
  id: string;
  name: string;
  start_date: string;
  status: string;
  is_active: boolean;
  is_portfolio: boolean;
  display_order: number;
  user_id: string;
  resource_links: ResourceLink[];
  client_id?: string | null;
  created_at?: string;
  due_date?: string | null;
  image?: string | null;
  industry?: string | null;
  notes?: string | null;
  team_members?: string | null;
  updated_at?: string | null;
  url?: string | null;
}