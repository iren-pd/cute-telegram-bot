export interface Wallet {
  kisses: number;
  premium: number;
  createdAt: string;
  updatedAt?: string;
}

export type UserRole = 'admin' | 'user' | 'guest';

export interface User {
  id: string;
  telegramId: number;
  username: string;
  role: UserRole;
  createdAt: string;
  updatedAt?: string;
  wallet: Wallet;
}
