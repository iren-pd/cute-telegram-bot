import { Wallet } from "./wallet.model";

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
}

export interface User {
  telegram_uid: string;
  nickname?: string;
  state?: string;
  createdAt: Date | string;
  role?: UserRole;
  wallet?: Wallet;
}
