import { Markup } from 'telegraf';
import { dishes } from '../../../data/dishes';
import { chunkArray } from '../../../utils/chunkArray';

export async function getCategoriesInlineKeyboard(category_id: number) {
  const currentCategoryDish = dishes.filter(
    (dish) => dish.category === category_id
  );
  const dishButtons = currentCategoryDish.map((dish) =>
    Markup.button.callback(dish.name, `dish_${dish.id}`)
  );

  const keyboard = chunkArray(dishButtons, 2);
  keyboard.push([
    Markup.button.callback('⬅️ Назад', 'back'),
    Markup.button.callback('🛒 Корзина', 'cart'),
  ]);
  return Markup.inlineKeyboard(keyboard);
}
