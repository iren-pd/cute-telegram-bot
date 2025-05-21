import { Scenes } from 'telegraf';
import mainMenuKeyboard from '../keyboards/mainMenuKeyboard';
import renderScreen from '../../utils/renderScreen';
import { UserRole, UserStatePage } from '../../models/user.model';
import getUser from '../../services/users/actions/getUser';
import 'dotenv/config';

const mainMenuScene = new Scenes.BaseScene<Scenes.SceneContext>('main_menu');

mainMenuScene.enter(async (ctx) => {
  const telegramId = ctx.from?.id;
  const user = telegramId ? await getUser(String(telegramId)) : null;
  if (!user) {
    await ctx.reply('Ошибка: не удалось получить данные пользователя.');
    await ctx.scene.enter('start');
    return;
  }

  if (user.role === UserRole.USER) {
    const now = new Date();
    const isBirthday = now.getDate() === 6 && now.getMonth() === 5;
    let text = '';
    if (isBirthday) {
      text += '🎉 С днём рождения, любимый! 🎂🥳\n';
      text +=
        '☀️ Будь все таким же солнышком в моей жизни, ведь ты самый лучший мужчина в мире!\n';
      text +=
        '🎁 В твой особенный день, я хочу подарить тебе что-то особенное. Ни на что не похожее и не повторимое.\n\n';
    } else {
      text += '💌 Любимый Вадик! 💌\n\n';
    }

    text +=
      '🍽️ Этот бот создан, чтобы облегчить наши вечные муки с тем, чтобы выбрать, что приготовить. Поэтому тут ты можешь посмотреть меню, выбрать блюдо и оформить заказ прямо как в ресторане.\n\n';
    text +=
      '😏 Но не всё так просто! За все нужно платить, но конечно же не деньгами, а поцелуйчиками 😘\n\n';
    text += '💋 Попробуй прямо сейчас!';

    await renderScreen(
      ctx,
      text,
      user.role,
      UserStatePage.MAIN_MENU,
      user.state,
      mainMenuKeyboard
    );
    return;
  } else {
    await ctx.reply('Нет доступа. Пожалуйста, авторизуйтесь.');
    await ctx.scene.enter('start');
    return;
  }
});

export default mainMenuScene;
