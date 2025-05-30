import { Dish } from '../../../models/dish.model';
import { chunkArray } from '../../../utils/chunkArray';

export function getDishKeyboard(dish: Dish) {
  const keyboard = {
    inline_keyboard: [] as any[],
  };

  if (dish.options && dish.options.length > 0) {
    const chunkedOptions = chunkArray(dish.options, 2);
    keyboard.inline_keyboard.push(
      ...chunkedOptions.map((row) =>
        row.map((option) => ({
          text: option,
          callback_data: `option_${option}`,
        }))
      )
    );
  }

  keyboard.inline_keyboard.push(
    [{ text: '🛒 Добавить в заказ', callback_data: `add_to_cart_${dish.id}` }],
    [
      { text: '⬅️ Назад', callback_data: 'back' },
      { text: '🛒 Корзина', callback_data: 'cart' },
    ]
  );

  return keyboard;
}
