import { Scenes } from 'telegraf';
import { UserRole, UserState, UserStatePage } from '../../models/user.model';
import getUser from '../../services/users/actions/getUser';
import updateUser from '../../services/users/actions/updateUser';
import { getMenuInlineKeyboard } from '../keyboards/user/menuKeyboard';
import renderScreen from '../../utils/renderScreen';

const menuScene = new Scenes.BaseScene<Scenes.SceneContext>('menu');

menuScene.enter(async (ctx) => {
  const telegramId = ctx.from?.id;
  if (!telegramId) return ctx.scene.enter('start');
  const user = await getUser(String(telegramId));
  if (!user) return ctx.scene.enter('start');

  if (user.role === UserRole.USER) {
    await updateUser(String(telegramId), {
      state: {
        ...user.state,
        previousPage: user.state.currentPage,
        currentPage: UserStatePage.MENU,
      },
    });

    const menuKeyboard = await getMenuInlineKeyboard();

    await updateUser(String(telegramId), {
      state: {
        ...user.state,
        previousPage: user.state.currentPage,
        currentPage: UserStatePage.MENU,
      },
    });
    const updatedUser = await getUser(String(telegramId));

    await renderScreen(
      ctx,
      'Для начала выбери категорию:',
      updatedUser?.role || UserRole.USER,
      UserStatePage.MENU,
      updatedUser?.state as UserState,
      menuKeyboard
    );

    return;
  }

  return;
});

menuScene.hears('⬅️ Назад', async (ctx) => {
  const telegramId = ctx.from?.id;
  if (!telegramId) return ctx.scene.enter('start');
  const user = await getUser(String(telegramId));
  if (!user) return ctx.scene.enter('start');
  const previousPage = user.state.previousPage || UserStatePage.MAIN_MENU;
  await ctx.scene.enter(previousPage);
  return;
});

menuScene.hears('🛒 Корзина', async (ctx) => {
  await ctx.scene.enter('cart');
});

// menuScene.on('callback_query', async (ctx) => {
//   const data = ctx.callbackQuery?.data;
//   if (data && data.startsWith('category_')) {
//     const categoryId = data.replace('category_', '');
//     await ctx.answerCbQuery();
//     await ctx.reply(`Вы выбрали категорию с id: ${categoryId}`);
//   }
// });

export default menuScene;
