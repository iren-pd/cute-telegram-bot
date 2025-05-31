import { Markup } from 'telegraf';
import { OrderDish } from '../../../models/order.model';

export const getCartInlineKeyboard = (dishes: OrderDish[]) => {
  const buttons = [];

  if (dishes && dishes.length > 0) {
    dishes.forEach((orderDish, index) => {
      buttons.push([
        Markup.button.callback(
          `❌ Удалить ${orderDish.dish.name}`,
          `remove_dish_${orderDish.dish.id}`
        ),
      ]);
    });

    // Добавляем кнопку подтверждения заказа, если есть блюда
    buttons.push([
      Markup.button.callback('✅ Подтвердить заказ', 'confirm_order'),
    ]);
  }

  buttons.push([
    Markup.button.callback('⬅️ Назад', 'back_to_menu'),
    Markup.button.callback('🍽️Меню', 'go_to_menu'),
  ]);

  return Markup.inlineKeyboard(buttons);
};
