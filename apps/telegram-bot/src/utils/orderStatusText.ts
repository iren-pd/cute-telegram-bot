import { OrderStatus, OrderPaymentStatus } from '../models/order.model';

export function getOrderStatusText(user: any) {
  return (
    `Статус заказа: ${user.state.cart.status || OrderStatus.NO_STATUS}\n` +
    `Статус оплаты: ${
      user.state.cart.paymentStatus || OrderPaymentStatus.NOT_APPLICABLE
    }\n`
  );
}
