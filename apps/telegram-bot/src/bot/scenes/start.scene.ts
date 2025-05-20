import { Scenes } from 'telegraf';
import registerUser from '../../services/users/actions/registerUser';
import { UserRole } from '../../models/user.model';

export const startScene = new Scenes.BaseScene<Scenes.SceneContext>('start');

startScene.enter(async (ctx) => {
  if (!ctx.from?.username) {
    await ctx.reply(
      'У вас не установлен username в Telegram. Пожалуйста, установите его для использования бота.'
    );
    return ctx.scene.leave();
  }

  const dateOfCreated = new Date().toISOString();

  await registerUser({
    telegram_uid: String(ctx.from.id),
    nickname: ctx.from.username,
    createdAt: dateOfCreated,
    role: UserRole.USER,
    wallet: {
      kisses: 0,
      hugs: 0,
      createdAt: dateOfCreated,
    },
  });

  await ctx.reply(
    `Привет, ${ctx.from.username}! Добро пожаловать в нашего бота!`
  );
  ctx.scene.leave();
});
