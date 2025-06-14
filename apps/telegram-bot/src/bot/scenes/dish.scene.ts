import { Scenes } from 'telegraf';
import {
  UserRole,
  UserStatePage,
  UserState,
  PageWithId,
} from '../../models/user.model';
import getUser from '../../services/users/actions/getUser';
import { dishes as allDishes } from '../../data/dishes';
import updateUser from '../../services/users/actions/updateUser';
import renderScreen from '../../utils/renderScreen';
import { addToCart } from '../../services/dish/addToCart';
import { getDishKeyboard } from '../keyboards/user/dishKeyboard';
import { removeFromCart } from '../../services/dish/removeFromCart';

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

    const state = ctx.scene.state as { selectedOptions?: string[] };
    state.selectedOptions = state.selectedOptions || [];

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
        currentPage: `dish_${dishId}` as PageWithId,
      },
    });
    const updatedUser = await getUser(String(telegramId));

    const keyboard = await getDishKeyboard(
      dish,
      state.selectedOptions,
      String(telegramId)
    );

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

dishScene.action(/add_option_(.+)/, async (ctx) => {
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
    messageText += `\n\nДобавлено: ${state.selectedOptions.join(', ')}`;
  }

  const keyboard = await getDishKeyboard(
    dish,
    state.selectedOptions,
    String(telegramId)
  );

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

dishScene.action(/remove_option_(.+)/, async (ctx) => {
  const optionValue = ctx.match[1];
  const dishId = (ctx.scene.state as { dishId?: string }).dishId;
  const telegramId = ctx.from?.id;
  if (!telegramId || !dishId) return;

  const dish = allDishes.find((d) => d.id === dishId);
  if (!dish || !dish.options) return;

  const state = ctx.scene.state as { selectedOptions?: string[] };
  state.selectedOptions = state.selectedOptions || [];
  const idx = state.selectedOptions.indexOf(optionValue);
  if (idx !== -1) {
    state.selectedOptions.splice(idx, 1);
  }

  let messageText = `
${dish.name}
${dish.description}

⏱ Время приготовления: ${dish.cookingTime} мин
🧑‍🍳 Мое мнение: ${dish.opinion}
💰 Цена: ${dish.price} ${dish.currency}`;

  if (state.selectedOptions.length) {
    messageText += `\n\nДобавлено: ${state.selectedOptions.join(', ')}`;
  }

  const keyboard = await getDishKeyboard(
    dish,
    state.selectedOptions,
    String(telegramId)
  );

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

  await ctx.answerCbQuery(`Удалено: ${optionValue}`);
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

    const user = await getUser(String(telegramId));
    if (user) {
      const keyboard = await getDishKeyboard(
        dish,
        selectedOptions,
        String(telegramId)
      );
      await ctx.editMessageReplyMarkup(keyboard.reply_markup);
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    await ctx.answerCbQuery('❌ Ошибка при добавлении в корзину');
  }
});

dishScene.action(/remove_from_cart_(.+)/, async (ctx) => {
  const dishId = ctx.match[1];
  const telegramId = ctx.from?.id;

  if (!telegramId) {
    await ctx.answerCbQuery('Ошибка: не удалось определить пользователя');
    return;
  }

  try {
    await removeFromCart(String(telegramId), dishId);
    await ctx.answerCbQuery('✅ Блюдо удалено из корзины');

    const dish = allDishes.find((d) => d.id === dishId);
    if (dish) {
      const selectedOptions = (
        ctx.scene.state as { selectedOptions?: string[] }
      ).selectedOptions;
      const keyboard = await getDishKeyboard(
        dish,
        selectedOptions,
        String(telegramId)
      );
      await ctx.editMessageReplyMarkup(keyboard.reply_markup);
    }
  } catch (error) {
    console.error('Error removing from cart:', error);
    await ctx.answerCbQuery('❌ Ошибка при удалении из корзины');
  }
});

dishScene.action('back', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.editMessageReplyMarkup({ inline_keyboard: [] });
  await ctx.scene.enter('category_');
});

dishScene.action('cart', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.editMessageReplyMarkup({ inline_keyboard: [] });
  await ctx.scene.enter('cart');
});

export default dishScene;
