import { Scenes } from 'telegraf';
import cartKeyboard from '../keyboards/user/cartKeyboard';
import renderScreen from '../../utils/renderScreen';
import { UserStatePage, User } from '../../models/user.model';
import getUser from '../../services/users/actions/getUser';
import updateUser from '../../services/users/actions/updateUser';
import { OrderStatus, OrderPaymentStatus } from '../../models/order.model';

const cartScene = new Scenes.BaseScene<Scenes.SceneContext>('cart');

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

  let cartText = '🛒 Твоя Корзина 🛒\n\n';
  cartText += `Статус заказа: ${
    updatedUser.state.cart.status || OrderStatus.NO_STATUS
  }\n`;
  cartText += `Статус оплаты: ${
    updatedUser.state.cart.paymentStatus || OrderPaymentStatus.NOT_APPLICABLE
  }\n\n`;

  if (
    updatedUser.state.cart.dishes &&
    updatedUser.state.cart.dishes.length > 0
  ) {
    cartText += 'Выбранные блюда:\n';
    updatedUser.state.cart.dishes.forEach((orderDish) => {
      cartText += `- ${orderDish.dish.name} (x${orderDish.quantity || 1})\n`;
    });
  } else {
    cartText += 'Пока ничего не выбрано. Пора это исправить! 😉';
    if (
      updatedUser.state.cart.payment.kisses !== 0 ||
      updatedUser.state.cart.payment.premium !== 0
    ) {
      await updateUser(String(telegramId), {
        state: {
          ...updatedUser.state,
          cart: {
            ...updatedUser.state.cart,
            payment: { kisses: 0, premium: 0 },
          },
        },
      });
    }
  }

  await renderScreen(
    ctx,
    cartText,
    updatedUser.role,
    UserStatePage.CART,
    updatedUser.state,
    cartKeyboard
  );

  return;
});

cartScene.hears('⬅️ Назад', async (ctx) => {
  await ctx.scene.enter('main_menu');
  return;
});

cartScene.hears('🍽️Меню', async (ctx) => {
  await ctx.scene.enter('menu');
  return;
});

export default cartScene;
