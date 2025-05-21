import { Scenes } from 'telegraf';
import registerUser from '../../services/users/actions/registerUser';
import getUser from '../../services/users/actions/getUser';
import { updateUser } from '../../services/users/actions/updateUser';
import { UserRole } from '../../models/user.model';
import { isGuest, isUser, isAdmin } from '../../utils/getUserState';

export const startScene = new Scenes.BaseScene<Scenes.SceneContext>('start');

startScene.enter(async (ctx) => {
  if (!ctx.from?.username) {
    await ctx.reply(
      'У вас не установлен username в Telegram. Пожалуйста, установите его для использования бота.'
    );
    return ctx.scene.leave();
  }

  try {
    const existingUser = await getUser(String(ctx.from.id));

    if (existingUser) {
      if (isUser(existingUser)) {
        await ctx.reply('Для вас доступ закрыт.');
        return ctx.scene.leave();
      }

      if (isGuest(existingUser) && existingUser.id) {
        const updated = await updateUser(existingUser.id, {
          role: UserRole.USER,
        });
        if (updated) {
          await ctx.reply(
            'Ваша роль обновлена на USER. Для вас доступ закрыт.'
          );
        } else {
          await ctx.reply(
            'Произошла ошибка при обновлении роли. Пожалуйста, попробуйте позже.'
          );
        }
        return ctx.scene.leave();
      }

      if (isAdmin(existingUser)) {
        await ctx.reply(
          `Привет, ${ctx.from.username}! Добро пожаловать в панель администратора!`
        );
        return ctx.scene.leave();
      }
    }

    const dateOfCreated = new Date().toISOString();
    const isNewUserAdmin = ctx.from.username.toLowerCase().includes('admin');

    await registerUser({
      telegram_uid: String(ctx.from.id),
      nickname: ctx.from.username,
      createdAt: dateOfCreated,
      role: isNewUserAdmin ? UserRole.ADMIN : UserRole.USER,
      wallet: {
        kisses: 0,
        hugs: 0,
        createdAt: dateOfCreated,
      },
    });

    const welcomeMessage = isNewUserAdmin
      ? `Привет, ${ctx.from.username}! Добро пожаловать в панель администратора!`
      : `Привет, ${ctx.from.username}! У тебя нет доступа к боту.`;

    await ctx.reply(welcomeMessage);
    ctx.scene.leave();
  } catch (error) {
    console.error('Error in start scene:', error);
    await ctx.reply('Произошла ошибка. Пожалуйста, попробуйте позже.');
    ctx.scene.leave();
  }
});
