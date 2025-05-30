import { Scenes } from 'telegraf';
import { UserRole, UserStatePage, UserState } from '../models/user.model';
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
  route: UserStatePage,
  state: UserState,
  keyboard?: any
) => {
  if (role !== UserRole.USER && role !== UserRole.ADMIN) {
    await ctx.reply('У вас нет доступа к боту.');
    return ctx.scene.enter('start');
  }
  const validPages = Object.values(UserStatePage);
  if (!state.currentPage || !validPages.includes(state.currentPage)) {
    await ctx.reply(
      'Что-то пошло не так, возвращаю в главное меню...',
      mainMenuKeyboard
    );
    return ctx.scene.enter('main_menu');
  }

  if (state.currentPage !== route) {
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
