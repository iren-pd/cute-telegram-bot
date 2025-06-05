import { Scenes } from 'telegraf';
import {
  UserRole,
  UserState,
  PageWithId,
  UserStatePage,
} from '../models/user.model';
import mainMenuKeyboard from '../bot/keyboards/user/mainMenuKeyboard';

/**
 * Универсальный рендеринг экрана с проверкой роли, стейта и маршрута.
 * @param ctx - Telegraf context
 * @param message - текст сообщения
 * @param role - роль пользователя
 * @param route - ожидаемая страница (UserStatePage)
 * @param state - state пользователя
 * @param keyboard - клавиатура (опционально)
 */
const renderScreen = async (
  ctx: Scenes.SceneContext,
  message: string,
  role: UserRole,
  route: PageWithId,
  state: UserState,
  keyboard?: any
) => {
  if (role !== UserRole.USER && role !== UserRole.ADMIN) {
    await ctx.reply('У вас нет доступа к боту.');
    return ctx.scene.enter('start');
  }

  if (!state.currentPage) {
    await ctx.reply(
      'Что-то пошло не так, возвращаю в главное меню...',
      mainMenuKeyboard
    );
    ctx.scene.enter('main_menu');
    return;
  }

  const validPages = Object.values(UserStatePage);
  if (!validPages.includes(route as UserStatePage)) {
    await ctx.reply('Вы были перемещены в главное меню.', mainMenuKeyboard);
    ctx.scene.enter('main_menu');
    return;
  }

  if (keyboard) {
    await ctx.reply(message, keyboard);
  } else {
    await ctx.reply(message);
  }
  return;
};

export default renderScreen;
