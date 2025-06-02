import { Scenes } from 'telegraf';
import { UserRole, UserState, UserStatePage } from '../../../models/user.model';
import getUser from '../../../services/users/actions/getUser';
import updateUser from '../../../services/users/actions/updateUser';
import renderScreen from '../../../utils/renderScreen';
import getCategories from '../../../services/category/getCategories';
import { getMenuInlineKeyboard } from '../../keyboards/user/menuKeyboard';

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

  await ctx.editMessageReplyMarkup({ inline_keyboard: [] });
  await ctx.reply('Выбрано "⬅️ Назад". Возвращаю назад...');
  await ctx.scene.enter(previousPage);
  return;
});

menuScene.hears('🛒 Корзина', async (ctx) => {
  await ctx.editMessageReplyMarkup({ inline_keyboard: [] });
  await ctx.reply('Выбрано "🛒 Корзина". Открываю корзину...');
  await ctx.scene.enter('cart');
});

menuScene.on('callback_query', async (ctx) => {
  // @ts-ignore
  const data =
    ctx.callbackQuery && 'data' in ctx.callbackQuery
      ? (ctx.callbackQuery as any).data
      : undefined;
  if (data && data.startsWith('category_')) {
    const categoryId = Number(data.replace('category_', ''));
    const categories = await getCategories();
    const category = categories.find((cat) => cat.id === categoryId);
    const categoryName = category?.name || 'Категория';

    await ctx.answerCbQuery();
    await ctx.editMessageReplyMarkup({ inline_keyboard: [] });
    await ctx.scene.enter('category_', { categoryId, categoryName });
  }
});

export default menuScene;
