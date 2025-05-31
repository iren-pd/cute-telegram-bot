import { Scenes, Markup } from 'telegraf';
import getUser from '../../../services/users/actions/getUser';
import updateUser from '../../../services/users/actions/updateUser';
import { OrderPaymentStatus, OrderStatus } from '../../../models/order.model';
import { renderCart } from '../../scenes/cart.scene';
import { getOrderStatusText } from '../../../utils/orderStatusText';

export const confirmOrder = async (ctx: Scenes.SceneContext) => {
  const telegramId = ctx.from?.id;
  if (!telegramId) return;

  const user = await getUser(String(telegramId));
  if (!user) return;

  await updateUser(String(telegramId), {
    state: {
      ...user.state,
      cart: {
        ...user.state.cart,
        status: OrderStatus.PROCESSING,
        paymentStatus: OrderPaymentStatus.PENDING,
      },
    },
  });

  const updatedUser = await getUser(String(telegramId));
  const orderStatusText = getOrderStatusText(updatedUser);
  const confirmationText =
    '✅ Заказ подтвержден!\n\n' +
    orderStatusText +
    '\n⚠️ Внимание: Ты будешь получать уведомления об изменении статуса заказа.\n\n' +
    '🔄 Статус заказа будет обновляться автоматически.';

  const confirmationKeyboard = Markup.inlineKeyboard([
    [Markup.button.callback('❌ Отменить заказ', 'cancel_order')],
  ]);

  await ctx.editMessageText(confirmationText, {
    parse_mode: 'HTML',
    ...confirmationKeyboard,
  });
};

export const cancelOrder = async (ctx: Scenes.SceneContext) => {
  const telegramId = ctx.from?.id;
  if (!telegramId) return;

  const user = await getUser(String(telegramId));
  if (!user) return;

  await updateUser(String(telegramId), {
    state: {
      ...user.state,
      cart: {
        ...user.state.cart,
        status: OrderStatus.CANCELLED,
        paymentStatus: OrderPaymentStatus.FAILED,
      },
    },
  });

  const updatedUser = await getUser(String(telegramId));
  if (updatedUser) {
    const orderStatusText = getOrderStatusText(updatedUser);
    const cancelText =
      '❌ Заказ отменён!\n\n' +
      orderStatusText +
      '\nВы всегда можете оформить новый заказ!';
    await ctx.editMessageText(cancelText, { parse_mode: 'HTML' });

    await updateUser(String(telegramId), {
      state: {
        ...user.state,
        cart: {
          ...user.state.cart,
          status: OrderStatus.NEW,
          paymentStatus: OrderPaymentStatus.PENDING_CONFIRMATION,
        },
      },
    });
    const updatedUserAfterCancel = await getUser(String(telegramId));
    if (updatedUserAfterCancel) {
      await renderCart(ctx, updatedUserAfterCancel);
    }
  }
};
