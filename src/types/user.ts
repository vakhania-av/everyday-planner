export interface IUser {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export type AuthUser = IUser | null;
