import { Dish } from './dish.model';

export enum OrderStatus {
  NO_STATUS = '📝 Ожидает оформления',
  NEW = '🆕 Новый',
  PROCESSING = '🔄 В обработке',
  WORK = '🔄 В работе',
  READY = '✅ Готов',
  CANCELLED = '❌ Отменён',
}

export enum OrderPaymentStatus {
  PENDING = '⏳ Ожидает оплаты',
  PENDING_CONFIRMATION = '⏳ Ожидает подтверждения заказа',
  PAID_KISSES = '😘 Оплачено',
  PAID_PREMIUM = '💎 Оплачено',
  PAID_MIXED = '💞 Оплачено',
  FAILED = '⚠️ Ошибка оплаты',
  NOT_APPLICABLE = '❓ Выбери блюдо, чтобы оплатить',
}

export interface OrderDish {
  dish: Dish;
  selectedOptions: string[] | undefined;
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
  paymentStatus: OrderPaymentStatus;
  comment?: string;
  payment: OrderPayment;
  createdAt: string;
  updatedAt?: string;
}
