import { Scenes } from 'telegraf';
import { getCartInlineKeyboard } from '../keyboards/user/cartKeyboard';
import renderScreen from '../../utils/renderScreen';
import { UserStatePage, User } from '../../models/user.model';
import getUser from '../../services/users/actions/getUser';
import updateUser from '../../services/users/actions/updateUser';
import { OrderStatus, OrderPaymentStatus } from '../../models/order.model';
import { Currency, CurrencyEmoji } from '../../models/dish.model';
import { removeFromCart } from '../../services/dish/removeFromCart';

const cartScene = new Scenes.BaseScene<Scenes.SceneContext>('cart');

const renderCart = async (ctx: Scenes.SceneContext, user: User) => {
  let cartText = '🛒 Твоя Корзина 🛒\n\n';
  cartText += `Статус заказа: ${
    user.state.cart.status || OrderStatus.NO_STATUS
  }\n`;
  cartText += `Статус оплаты: ${
    user.state.cart.paymentStatus || OrderPaymentStatus.NOT_APPLICABLE
  }\n`;

  if (user.state.cart.dishes && user.state.cart.dishes.length > 0) {
    cartText += `\n💰 Общая стоимость:\n`;
    if (user.state.cart.totalPrice.kisses > 0) {
      cartText += `${user.state.cart.totalPrice.kisses} ${CurrencyEmoji.KISSES} ${Currency.KISSES}\n`;
    }
    if (user.state.cart.totalPrice.premium > 0) {
      cartText += `${user.state.cart.totalPrice.premium} ${CurrencyEmoji.PREMIUM} ${Currency.PREMIUM}\n`;
    }
    cartText += '\nВыбранные блюда:\n';
    user.state.cart.dishes.forEach((orderDish, index) => {
      const dishCurrency =
        orderDish.dish.currency === Currency.KISSES
          ? CurrencyEmoji.KISSES
          : CurrencyEmoji.PREMIUM;
      cartText += `${index + 1}. ${orderDish.dish.name} (x${
        orderDish.quantity || 1
      }) - ${orderDish.dish.price} ${dishCurrency}`;
      if (orderDish.selectedOptions && orderDish.selectedOptions.length > 0) {
        cartText += '\n  -' + orderDish.selectedOptions.join(', ');
      }
      cartText += '\n\n';
    });
  } else {
    cartText += 'Пока ничего не выбрано. Пора это исправить! 😉';
    if (
      user.state.cart.payment.kisses !== 0 ||
      user.state.cart.payment.premium !== 0
    ) {
      await updateUser(String(user.telegramId), {
        state: {
          ...user.state,
          cart: {
            ...user.state.cart,
            payment: { kisses: 0, premium: 0 },
          },
        },
      });
    }
  }

  await renderScreen(
    ctx,
    cartText,
    user.role,
    UserStatePage.CART,
    user.state,
    getCartInlineKeyboard(user.state.cart.dishes)
  );
};

cartScene.enter(async (ctx) => {
  const telegramId = ctx.from?.id;
  if (!telegramId) {
    await ctx.reply('Ошибка: не удалось получить данные пользователя.');
    return ctx.scene.enter('start');
  }
  const user = await getUser(String(telegramId));

  if (!user) {
    await ctx.reply('Ошибка: не удалось получить данные пользователя.');
    return ctx.scene.enter('start');
  }

  await updateUser(String(telegramId), {
    state: {
      ...user.state,
      previousPage: user.state.currentPage,
      currentPage: UserStatePage.CART,
    },
  });

  const updatedUser = (await getUser(String(telegramId))) as User;
  await renderCart(ctx, updatedUser);
  return;
});

cartScene.action(/^remove_dish_(.+)$/, async (ctx) => {
  const telegramId = ctx.from?.id;
  if (!telegramId) return;

  const dishId = ctx.match[1];
  await removeFromCart(String(telegramId), dishId);

  const updatedUser = await getUser(String(telegramId));
  if (updatedUser) {
    await renderCart(ctx, updatedUser);
  }
});

cartScene.action('back_to_menu', async (ctx) => {
  await ctx.scene.enter('main_menu');
});

cartScene.action('go_to_menu', async (ctx) => {
  await ctx.scene.enter('menu');
});

export default cartScene;
