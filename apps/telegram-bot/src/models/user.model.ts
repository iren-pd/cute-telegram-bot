import { Order } from './order.model';

export interface Wallet {
  kisses: number;
  premium: number;
  createdAt: string;
  updatedAt?: string;
}

export type UserRole = 'admin' | 'user' | 'guest';

export interface UserState {
  currentPage: string;
  previousPage: string;
  cart: Order;
}

export interface User {
  id: string;
  telegramId: number;
  username: string;
  role: UserRole;
  createdAt: string;
  updatedAt?: string;
  wallet: Wallet;
  state: UserState;
}
