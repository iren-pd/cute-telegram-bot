import { Scenes } from 'telegraf';
import { OrderStatus, OrderPaymentStatus } from '../../models/order.model';
import { UserRole, UserStatePage } from '../../models/user.model';
import getUser from '../../services/users/actions/getUser';
import updateUser from '../../services/users/actions/updateUser';
import renderScreen from '../../utils/renderScreen';
import { getAdminOrderKeyboard } from '../keyboards/admin/adminOrderKeyboard';

const adminOrderScene = new Scenes.BaseScene<Scenes.SceneContext>('admin_order');

export const renderOrder = async (ctx: Scenes.SceneContext, user: any) => {
  let orderText = `👤 Пользователь: @${user.username}\n\n`;
  orderText += `📦 Заказ:\n`;

  if (user.state.cart.dishes && user.state.cart.dishes.length > 0) {
    user.state.cart.dishes.forEach((orderDish: any, index: number) => {
      orderText += `${index + 1}. ${orderDish.dish.name} (x${orderDish.quantity || 1})`;
      if (orderDish.selectedOptions && orderDish.selectedOptions.length > 0) {
        orderText += '\n  -' + orderDish.selectedOptions.join(', ');
      }
      orderText += '\n';
    });

    orderText += `\n💰 Стоимость:\n`;
    if (user.state.cart.totalPrice.kisses > 0) {
      orderText += `${user.state.cart.totalPrice.kisses} 😘\n`;
    }
    if (user.state.cart.totalPrice.premium > 0) {
      orderText += `${user.state.cart.totalPrice.premium} 💎\n`;
    }
  } else {
    orderText += 'Нет активных заказов';
  }

  orderText += `\n\n📝 Статус заказа: ${user.state.cart.status}`;
  orderText += `\n💳 Статус оплаты: ${user.state.cart.paymentStatus}`;

  const keyboard = getAdminOrderKeyboard(user.state.cart);
  await renderScreen(ctx, orderText, UserRole.ADMIN, UserStatePage.ADMIN_PANEL, user.state, keyboard);
};

adminOrderScene.enter(async (ctx) => {
  const telegramId = ctx.from?.id;
  if (!telegramId) {
    await ctx.reply('Ошибка: не удалось получить данные пользователя.');
    return ctx.scene.leave();
  }

  const admin = await getUser(String(telegramId));
  if (!admin || admin.role !== UserRole.ADMIN) {
    await ctx.reply('У вас нет доступа к панели администратора.');
    return ctx.scene.leave();
  }

  const userId = (ctx.scene.state as { userId?: string }).userId;
  console.log('userId', userId);
  if (!userId) {
    await ctx.reply('Ошибка: не указан пользователь.');
    return ctx.scene.leave();
  }

  const user = await getUser(userId);
  if (!user) {
    await ctx.reply('Пользователь не найден.');
    return ctx.scene.leave();
  }

  await renderOrder(ctx, user);
});

adminOrderScene.action(/^set_order_status_(.+)$/, async (ctx) => {
  const status = ctx.match[1] as OrderStatus;
  const userId = (ctx.scene.state as { userId?: string }).userId;
  if (!userId) return;

  const user = await getUser(userId);
  if (!user) return;

  await updateUser(userId, {
    state: {
      ...user.state,
      cart: {
        ...user.state.cart,
        status: status,
      },
    },
  });

  const updatedUser = await getUser(userId);
  if (updatedUser) {
    await renderOrder(ctx, updatedUser);
  }
});

adminOrderScene.action(/^set_payment_status_(.+)$/, async (ctx) => {
  const status = ctx.match[1] as OrderPaymentStatus;
  const userId = (ctx.scene.state as { userId?: string }).userId;
  if (!userId) return;

  const user = await getUser(userId);
  if (!user) return;

  await updateUser(userId, {
    state: {
      ...user.state,
      cart: {
        ...user.state.cart,
        paymentStatus: status,
      },
    },
  });

  const updatedUser = await getUser(userId);
  if (updatedUser) {
    await renderOrder(ctx, updatedUser);
  }
});

adminOrderScene.action('back_to_admin_panel', async (ctx) => {
  await ctx.scene.enter('admin_panel');
});

export default adminOrderScene;