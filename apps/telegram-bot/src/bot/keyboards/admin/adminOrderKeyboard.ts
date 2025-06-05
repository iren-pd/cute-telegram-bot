import { Markup } from 'telegraf';
import { OrderStatus, OrderPaymentStatus } from '../../../models/order.model';

export const getAdminOrderKeyboard = (cart: any) => {
  const orderStatusButtons = Object.values(OrderStatus).map(status => 
    [Markup.button.callback(
      status === cart.status ? `✅ ${status}` : status,
      `set_order_status_${status}`
    )]
  );

  const paymentStatusButtons = Object.values(OrderPaymentStatus).map(status => 
    [Markup.button.callback(
      status === cart.paymentStatus ? `✅ ${status}` : status,
      `set_payment_status_${status}`
    )]
  );

  return Markup.inlineKeyboard([
    ...orderStatusButtons,
    ...paymentStatusButtons,
    [Markup.button.callback('🔙 Назад к панели администратора', 'back_to_admin_panel')]
  ]);
};