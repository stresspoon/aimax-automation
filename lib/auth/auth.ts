import type { AuthAdapter, User } from "./types";

// Placeholder interface for real OAuth provider integration
export const authAdapter: AuthAdapter = {
  async login(): Promise<User> {
    throw new Error("AuthAdapter.login not implemented");
  },
  async logout(): Promise<void> {
    throw new Error("AuthAdapter.logout not implemented");
  },
  async getUser(): Promise<User | null> {
    return null;
  },
  async isAuthenticated(): Promise<boolean> {
    return false;
  },
};

export type { AuthAdapter, User };


