import { Scenes } from 'telegraf';
import { UserRole, UserStatePage, UserState } from '../../models/user.model';
import getUser from '../../services/users/actions/getUser';
import { dishes as allDishes } from '../../data/dishes';
import getCategoryDescription from '../../services/category/getCategoryDescription';
// @ts-ignore
import { getCategoriesInlineKeyboard } from '../keyboards/user/categoryKeyboard';
import renderScreen from '../../utils/renderScreen';
import updateUser from '../../services/users/actions/updateUser';

const categoryScene = new Scenes.BaseScene<Scenes.SceneContext>('category_');

categoryScene.enter(async (ctx) => {
  const telegramId = ctx.from?.id;
  const user = telegramId ? await getUser(String(telegramId)) : null;
  if (!user) {
    await ctx.reply('Ошибка: не удалось получить данные пользователя.');
    await ctx.scene.enter('start');
    return;
  }

  if (user.role === UserRole.USER) {
    const state = ctx.scene.state as {
      categoryId?: number;
      categoryName?: string;
    };
    const categoryId = state.categoryId;
    const categoryName = state.categoryName || 'Выбранная категория';

    if (typeof categoryId === 'undefined') {
      await ctx.reply('Ошибка: категория не выбрана. Возвращаюсь в меню.');
      await ctx.scene.enter('menu');
      return;
    }

    let description = '';
    try {
      description = await getCategoryDescription(categoryId);
    } catch {
      description = '';
    }

    const categoryDishes = allDishes.filter(
      (dish) => Number(dish.category) === Number(categoryId)
    );

    let messageText = `${categoryName}`;
    if (description) {
      messageText += `\n\n${description}`;
    }
    if (categoryDishes.length === 0) {
      messageText += `\n\nВ этой категории пока нет блюд.`;
    }

    const keyboard = await getCategoriesInlineKeyboard(categoryId);

    await updateUser(String(telegramId), {
      state: {
        ...user.state,
        previousPage: user.state.currentPage,
        currentPage: UserStatePage.CATEGORY,
      },
    });
    const updatedUser = await getUser(String(telegramId));

    await renderScreen(
      ctx,
      messageText,
      user.role,
      UserStatePage.CATEGORY,
      updatedUser?.state as UserState,
      keyboard
    );
  } else {
    await ctx.reply('У вас нет доступа к этому разделу.');
    await ctx.scene.enter('start');
  }
});

categoryScene.action(/dish_(.+)/, async (ctx) => {
  const dishId = ctx.match[1];
  await ctx.answerCbQuery();
  await ctx.editMessageReplyMarkup({ inline_keyboard: [] });
  await ctx.scene.enter('dish_', { dishId });
});

categoryScene.action('back', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.editMessageReplyMarkup({ inline_keyboard: [] });
  await ctx.scene.enter('menu');
});

categoryScene.action('cart', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.editMessageReplyMarkup({ inline_keyboard: [] });
  await ctx.scene.enter('cart');
});

export default categoryScene;
