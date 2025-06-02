import { Scenes } from 'telegraf';
import startScene from './user/start.scene';
import mainMenuScene from './user/main_menu.scene';
import 'dotenv/config';
import cartScene from './user/cart.scene';
import menuScene from './user/menu.scene';
import categoryScene from './user/category.scene';
import dishScene from './user/dish.scene';

const stage = new Scenes.Stage([
  startScene,
  mainMenuScene,
  cartScene,
  menuScene,
  categoryScene,
  dishScene,
]);

export default stage;
