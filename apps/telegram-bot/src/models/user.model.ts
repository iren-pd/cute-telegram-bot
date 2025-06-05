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
  DISH = 'dish',
  ADMIN_PANEL = 'admin_panel',
}

export type PageWithId =
  | UserStatePage
  | `dish_${string}`
  | `category_${number}`;

export interface UserState {
  currentPage: PageWithId;
  previousPage: PageWithId;
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
