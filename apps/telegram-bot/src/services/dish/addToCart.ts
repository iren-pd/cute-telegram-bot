import { Dish } from '../../models/dish.model';
import {
  OrderDish,
  OrderPaymentStatus,
  OrderStatus,
} from '../../models/order.model';
import getUser from '../users/actions/getUser';
import updateUser from '../users/actions/updateUser';

export async function addToCart(
  userId: string,
  dish: Dish,
  selectedOption?: string[]
): Promise<void> {
  const user = await getUser(userId);
  if (!user) return;

  const currentCart = user.state.cart || {
    id: '',
    userId: userId,
    dishes: [],
    totalPrice: { kisses: 0, premium: 0 },
    status: OrderStatus.NO_STATUS,
    paymentStatus: OrderPaymentStatus.NOT_APPLICABLE,
    payment: { kisses: 0, premium: 0 },
    createdAt: new Date().toISOString(),
  };

  const existingDishIndex = currentCart.dishes.findIndex(
    (item) => item.dish.id === dish.id
  );

  if (existingDishIndex !== -1) {
    currentCart.dishes[existingDishIndex].quantity += 1;
  } else {
    const orderDish: OrderDish = {
      dish: {
        ...dish,
      },
      selectedOptions: selectedOption ? selectedOption : undefined,
      quantity: 1,
    };
    currentCart.dishes.push(orderDish);
  }

  currentCart.totalPrice = {
    kisses: currentCart.dishes.reduce((sum, item) => sum + item.dish.price, 0),
    premium: 0,
  };

  currentCart.status = OrderStatus.NEW;
  currentCart.paymentStatus = OrderPaymentStatus.PENDING;

  await updateUser(userId, {
    state: {
      ...user.state,
      cart: currentCart,
    },
  });
}
