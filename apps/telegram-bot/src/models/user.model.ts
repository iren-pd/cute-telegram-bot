import { Order } from './order.model';

export interface Wallet {
  kisses: number;
  premium: number;
  createdAt: string;
  updatedAt?: string;
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
}

export enum UserStatePage {
  START = 'start',
  MAIN_MENU = 'main_menu',
  CART = 'cart',
  MENU = 'menu',
  CATEGORY = 'category',
}

export interface UserState {
  currentPage: UserStatePage;
  previousPage: UserStatePage;
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
