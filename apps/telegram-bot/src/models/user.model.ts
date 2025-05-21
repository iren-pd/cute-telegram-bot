import { Wallet } from './wallet.model';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  GUEST = 'GUEST',
}

export interface User {
  id?: string;
  telegram_uid: string;
  nickname: string;
  role: UserRole;
  createdAt: string;
  updatedAt?: string;
  wallet: Wallet;
}
