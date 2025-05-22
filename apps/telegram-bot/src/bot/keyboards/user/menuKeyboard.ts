import { Markup } from 'telegraf';
import getCategories from '../../../services/category/getCategories';

function chunkArray<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

export async function getMenuInlineKeyboard() {
  const categories = await getCategories();
  const categoryButtons = categories.map((cat) =>
    Markup.button.callback(cat.name, `category_${cat.id}`)
  );
  const keyboard = chunkArray(categoryButtons, 1);
  keyboard.push([
    Markup.button.callback('⬅️ Назад', 'back'),
    Markup.button.callback('🛒 Корзина', 'cart'),
  ]);
  return Markup.inlineKeyboard(keyboard);
}
