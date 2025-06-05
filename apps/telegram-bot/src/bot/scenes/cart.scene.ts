import { Scenes } from 'telegraf';
import { getCartInlineKeyboard } from '../keyboards/user/cartKeyboard';
import renderScreen from '../../utils/renderScreen';
import { UserStatePage, User } from '../../models/user.model';
import getUser from '../../services/users/actions/getUser';
import updateUser from '../../services/users/actions/updateUser';
import { Currency, CurrencyEmoji } from '../../models/dish.model';
import { removeFromCart } from '../../services/dish/removeFromCart';
import {
  confirmOrder,
  cancelOrder,
} from '../actions/user/confirmAndCancelOrder';
import { getOrderStatusText } from '../../utils/orderStatusText';

const cartScene = new Scenes.BaseScene<Scenes.SceneContext>('cart');

export const renderCart = async (ctx: Scenes.SceneContext, user: User) => {
  const orderStatusText = getOrderStatusText(user);
  let cartText = '🛒 Твоя Корзина 🛒\n\n';
  cartText += orderStatusText;

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
    await ctx.editMessageReplyMarkup({ inline_keyboard: [] });
  }
});

cartScene.action('confirm_order', confirmOrder);
cartScene.action('cancel_order', cancelOrder);

cartScene.action('back_to_menu', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.editMessageReplyMarkup({ inline_keyboard: [] });
  await ctx.scene.enter('main_menu');
});

cartScene.action('go_to_menu', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.editMessageReplyMarkup({ inline_keyboard: [] });
  await ctx.scene.enter('menu');
});

export default cartScene;
