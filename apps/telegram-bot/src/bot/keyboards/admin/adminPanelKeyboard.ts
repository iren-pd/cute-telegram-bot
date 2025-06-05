import { Markup } from 'telegraf';

export const getAdminPanelKeyboard = () => {
  return Markup.inlineKeyboard([
    [Markup.button.callback('🔄 Обновить заказы', 'refresh_orders')],
  ]);
};
