import { Markup } from 'telegraf';
import { Dish } from '../../../models/dish.model';
import { chunkArray } from '../../../utils/chunkArray';
import getUser from '../../../services/users/actions/getUser';

export async function getDishKeyboard(
  dish: Dish,
  selectedOptions: string[] = [],
  telegramId?: string
) {
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

  let isInCart = false;
  if (telegramId) {
    const user = await getUser(String(telegramId));
    if (user?.state.cart?.dishes) {
      isInCart = user.state.cart.dishes.some(
        (item) => item.dish.id === dish.id
      );
    }
  }

  keyboard.push([
    Markup.button.callback(
      isInCart ? '❌ Удалить из заказа' : '🛒 Добавить в заказ',
      isInCart ? `remove_from_cart_${dish.id}` : `add_to_cart_${dish.id}`
    ),
  ]);

  keyboard.push([
    Markup.button.callback('⬅️ Назад', 'back'),
    Markup.button.callback('🛒 Корзина', 'cart'),
  ]);

  return Markup.inlineKeyboard(keyboard);
}
