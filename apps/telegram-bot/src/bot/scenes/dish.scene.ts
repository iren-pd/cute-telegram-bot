import { Scenes } from 'telegraf';
import { UserRole, UserStatePage, UserState } from '../../models/user.model';
import getUser from '../../services/users/actions/getUser';
import { dishes as allDishes } from '../../data/dishes';
import updateUser from '../../services/users/actions/updateUser';
import renderScreen from '../../utils/renderScreen';
import { addToCart } from '../../services/dish/addToCart';
import { getDishKeyboard } from '../keyboards/user/dishKeyboard';
import { Markup } from 'telegraf';
import { chunkArray } from '../../utils/chunkArray';

const dishScene = new Scenes.BaseScene<Scenes.SceneContext>('dish_');

dishScene.enter(async (ctx) => {
  const dishId = (ctx.scene.state as { dishId?: string }).dishId;

  const telegramId = ctx.from?.id;
  const user = telegramId ? await getUser(String(telegramId)) : null;
  if (!user) {
    await ctx.reply('Ошибка: не удалось получить данные пользователя.');
    await ctx.scene.enter('start');
    return;
  }

  if (user.role === UserRole.USER) {
    if (!dishId) {
      await ctx.reply('Ошибка: блюдо не выбрано. Возвращаюсь в меню.');
      await ctx.scene.enter('menu');
      return;
    }

    const dish = allDishes.find((d) => d.id === dishId);
    if (!dish) {
      await ctx.reply('Ошибка: блюдо не найдено. Возвращаюсь в меню.');
      await ctx.scene.enter('menu');
      return;
    }

    const messageText = `
${dish.name}
${dish.description}

⏱ Время приготовления: ${dish.cookingTime} мин
🧑‍🍳 Мое мнение: ${dish.opinion}
💰 Цена: ${dish.price} ${dish.currency}
`;

    await updateUser(String(telegramId), {
      state: {
        ...user.state,
        previousPage: user.state.currentPage,
        currentPage: UserStatePage.DISH,
      },
    });
    const updatedUser = await getUser(String(telegramId));

    const keyboard = getDishKeyboard(dish);

    // await ctx.replyWithPhoto(dish.photoSrc, {
    //   caption: messageText,
    //   parse_mode: 'HTML',
    //   ...keyboard,
    // });

    await renderScreen(
      ctx,
      messageText,
      user.role,
      UserStatePage.DISH,
      updatedUser?.state as UserState,
      keyboard
    );
  } else {
    await ctx.reply('У вас нет доступа к этому разделу.');
    await ctx.scene.enter('start');
  }
});

dishScene.action(/option_(.+)/, async (ctx) => {
  const optionValue = ctx.match[1];
  const dishId = (ctx.scene.state as { dishId?: string }).dishId;
  const telegramId = ctx.from?.id;
  if (!telegramId || !dishId) return;

  const dish = allDishes.find((d) => d.id === dishId);
  if (!dish || !dish.options) return;

  const state = ctx.scene.state as { selectedOptions?: string[] };
  state.selectedOptions = state.selectedOptions || [];
  if (!state.selectedOptions.includes(optionValue)) {
    state.selectedOptions.push(optionValue);
  }

  let messageText = `
${dish.name}
${dish.description}

⏱ Время приготовления: ${dish.cookingTime} мин
🧑‍🍳 Мое мнение: ${dish.opinion}
💰 Цена: ${dish.price} ${dish.currency}`;

  if (state.selectedOptions.length) {
    messageText += `\nДобавлено: ${state.selectedOptions.join(', ')}`;
  }

  const remainingOptions = dish.options.filter(
    (option) => !state.selectedOptions!.includes(option)
  );
  const optionButtons = remainingOptions.map((option) =>
    Markup.button.callback(option, `option_${option}`)
  );
  const keyboardArr = chunkArray(optionButtons, 2);
  keyboardArr.push([
    Markup.button.callback('🛒 Добавить в заказ', `add_to_cart_${dish.id}`),
  ]);
  keyboardArr.push([
    Markup.button.callback('⬅️ Назад', 'back'),
    Markup.button.callback('🛒 Корзина', 'cart'),
  ]);
  const keyboard = Markup.inlineKeyboard(keyboardArr);

  try {
    await ctx.editMessageText(messageText, {
      parse_mode: 'HTML',
      ...keyboard,
    });
  } catch (e) {
    await ctx.reply(messageText, {
      parse_mode: 'HTML',
      ...keyboard,
    });
  }

  await ctx.answerCbQuery(`Добавлено: ${optionValue}`);
});

dishScene.action(/add_to_cart_(.+)/, async (ctx) => {
  const dishId = ctx.match[1];
  const telegramId = ctx.from?.id;

  if (!telegramId) {
    await ctx.answerCbQuery('Ошибка: не удалось определить пользователя');
    return;
  }

  const dish = allDishes.find((d) => d.id === dishId);
  if (!dish) {
    await ctx.answerCbQuery('Ошибка: блюдо не найдено');
    return;
  }

  const selectedOptions = (ctx.scene.state as { selectedOptions?: string[] })
    .selectedOptions;

  try {
    await addToCart(String(telegramId), dish, selectedOptions);
    await ctx.answerCbQuery('✅ Блюдо добавлено в корзину');
  } catch (error) {
    console.error('Error adding to cart:', error);
    await ctx.answerCbQuery('❌ Ошибка при добавлении в корзину');
  }
});

dishScene.action('back', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.scene.enter('category_');
});

dishScene.action('cart', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.scene.enter('cart');
});

export default dishScene;
