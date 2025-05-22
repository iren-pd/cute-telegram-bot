import { Scenes } from 'telegraf';
import { allowedUsers } from '../../config/user.config';
import registerUser from '../../services/users/actions/registerUser';
import updateUser from '../../services/users/actions/updateUser';
import getUser from '../../services/users/actions/getUser';
import { UserRole, UserStatePage } from '../../models/user.model';
import { OrderPaymentStatus, OrderStatus } from '../../models/order.model';

const startScene = new Scenes.BaseScene<Scenes.SceneContext>('start');

startScene.enter(async (ctx) => {
  if (!ctx.from) {
    await ctx.reply('Ошибка: не удалось получить данные пользователя.');
    return ctx.scene.leave();
  }
  const telegramId = ctx.from.id;
  const username = ctx.from.username || '';

  let user = await getUser(String(telegramId));

  if (!user) {
    user = {
      id: '',
      telegramId,
      username,
      role: UserRole.GUEST,
      createdAt: new Date().toISOString(),
      wallet: {
        kisses: 0,
        premium: 0,
        createdAt: new Date().toISOString(),
      },
      state: {
        currentPage: UserStatePage.START,
        previousPage: UserStatePage.START,
        cart: {
          id: '',
          userId: '',
          dishes: [],
          totalPrice: { kisses: 0, premium: 0 },
          status: OrderStatus.NO_STATUS,
          paymentStatus: OrderPaymentStatus.NOT_APPLICABLE,
          payment: { kisses: 0, premium: 0 },
          createdAt: new Date().toISOString(),
        },
      },
    };
    await registerUser(user);
  }

  if (allowedUsers.includes(username)) {
    if (user) {
      await updateUser(String(telegramId), {
        role: UserRole.USER,
        updatedAt: new Date().toISOString(),
        state: {
          ...user.state,
          currentPage: UserStatePage.MAIN_MENU,
        },
      });
      await ctx.scene.enter('main_menu');
    }
  } else {
    await ctx.reply('Вы не милый котик, у вас нет доступа к этому боту.');
    await ctx.scene.leave();
  }
});

export default startScene;
