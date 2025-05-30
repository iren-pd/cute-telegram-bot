import { OrderPaymentStatus, OrderStatus } from '../../models/order.model';
import getUser from '../users/actions/getUser';
import updateUser from '../users/actions/updateUser';

export async function removeFromCart(
  userId: string,
  dishId: string
): Promise<void> {
  const user = await getUser(userId);
  if (!user) return;

  const currentCart = user.state.cart;
  if (!currentCart) return;

  currentCart.dishes = currentCart.dishes.filter(
    (orderDish) => orderDish.dish.id !== dishId
  );

  currentCart.totalPrice = {
    kisses: currentCart.dishes.reduce((sum, item) => sum + item.dish.price, 0),
    premium: 0,
  };

  if (currentCart.dishes.length === 0) {
    currentCart.status = OrderStatus.NO_STATUS;
    currentCart.paymentStatus = OrderPaymentStatus.NOT_APPLICABLE;
  }

  await updateUser(userId, {
    state: {
      ...user.state,
      cart: currentCart,
    },
  });
}