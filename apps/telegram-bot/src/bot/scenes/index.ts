import { Scenes } from 'telegraf';
import startScene from './start.scene';
import mainMenuScene from './main_menu.scene';
import 'dotenv/config';
import cartScene from './cart.scene';
import menuScene from './menu.scene';
import categoryScene from './category.scene';
import dishScene from './dish.scene';
import adminPanelScene from './admin-panel.scene';
import adminOrderScene from './admin-order.scene';

const stage = new Scenes.Stage([
  startScene,
  mainMenuScene,
  cartScene,
  menuScene,
  categoryScene,
  dishScene,
  adminPanelScene,
  adminOrderScene,
]);

export default stage;
