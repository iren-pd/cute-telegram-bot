import { Markup } from 'telegraf';
import {
  Order,
  OrderStatus,
  OrderPaymentStatus,
} from '../../../models/order.model';
import { chunkArray } from '../../../utils/chunkArray';

const ADMIN_PAYMENT_STATUSES = [
  OrderPaymentStatus.PAID_KISSES,
  OrderPaymentStatus.FAILED,
];

const ADMIN_ORDER_STATUSES = [
  OrderStatus.WORK,
  OrderStatus.READY,
  OrderStatus.CANCELLED,
];

export const getAdminOrderKeyboard = (cart: Order) => {
  const orderStatusButtons = ADMIN_ORDER_STATUSES.map((status) =>
    Markup.button.callback(
      status === cart.status ? `✅ ${status}` : status,
      `set_order_status_${status}`
    )
  );

  const paymentStatusButtons = ADMIN_PAYMENT_STATUSES.map((status) =>
    Markup.button.callback(
      status === cart.paymentStatus ? `✅ ${status}` : status,
      `set_payment_status_${status}`
    )
  );

  return Markup.inlineKeyboard([
    ...chunkArray(orderStatusButtons, 2),
    ...chunkArray(paymentStatusButtons, 2),
    [
      Markup.button.callback(
        '🔙 Назад к панели администратора',
        'back_to_admin_panel'
      ),
    ],
  ]);
};
