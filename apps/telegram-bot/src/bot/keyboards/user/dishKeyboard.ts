import { Markup } from 'telegraf';
import { Dish } from '../../../models/dish.model';
import { chunkArray } from '../../../utils/chunkArray';

export function getDishKeyboard(dish: Dish, selectedOptions: string[] = []) {
  const optionButtons = (dish.options || []).map((option) => {
    const isSelected = selectedOptions.includes(option);
    if (isSelected) {
      if (option.includes('Добавить')) {
        return Markup.button.callback(
          option.replace(/(.*?\s*)Добавить/, '$1Удалить'),
          `remove_option_${option}`
        );
      } else {
        return Markup.button.callback(
          `Удалить: ${option}`,
          `remove_option_${option}`
        );
      }
    } else {
      return Markup.button.callback(option, `add_option_${option}`);
    }
  });

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
