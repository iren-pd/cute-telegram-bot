import { Dish } from './dish.model';

export type OrderStatus = 'no-status' | 'new' | 'processing' | 'ready' | 'cancelled';

export interface OrderDish {
  dish: Dish;
  quantity: number;
}

export interface OrderPayment {
  kisses: number;
  premium: number;
}

export interface OrderTotalPrice {
  kisses: number;
  premium: number;
}

export interface Order {
  id: string;
  userId: string;
  dishes: OrderDish[];
  totalPrice: OrderTotalPrice;
  status: OrderStatus;
  comment?: string;
  payment: OrderPayment;
  createdAt: string;
  updatedAt?: string;
}
