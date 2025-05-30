import { Markup } from 'telegraf';
import { Dish } from '../../../models/dish.model';
import { chunkArray } from '../../../utils/chunkArray';

export function getDishKeyboard(dish: Dish) {
  const optionButtons = (dish.options || []).map((option, idx) =>
    Markup.button.callback(option, `option_${idx}`)
  );

  const keyboard = chunkArray(optionButtons, 2);

  keyboard.push([
    Markup.button.callback('🛒 Добавить в заказ', `add_to_cart_${dish.id}`),
  ]);

  keyboard.push([
    Markup.button.callback('⬅️ Назад', 'back'),
    Markup.button.callback('🛒 Корзина', 'cart'),
  ]);

  return Markup.inlineKeyboard(keyboard);
}
