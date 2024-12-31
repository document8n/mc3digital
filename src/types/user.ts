export interface UserPublic {
  id: string;
  username: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface UserPrivate {
  id: string;
  role: 'admin' | 'user';
  approved: boolean;
  created_at: string;
  updated_at: string | null;
}