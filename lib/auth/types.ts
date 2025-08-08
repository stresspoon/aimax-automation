export type User = {
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
};

export type AuthContextShape = {
  isAuthenticated: boolean;
  user: User | null;
  login: () => Promise<void> | void;
  logout: () => Promise<void> | void;
};

export interface AuthAdapter {
  initialize?(): Promise<void> | void;
  login(): Promise<User> | User;
  logout(): Promise<void> | void;
  getUser(): Promise<User | null> | User | null;
  isAuthenticated(): Promise<boolean> | boolean;
}


