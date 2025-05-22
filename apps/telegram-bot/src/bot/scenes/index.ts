import { Scenes } from 'telegraf';
import startScene from './start.scene';
import mainMenuScene from './main_menu.scene';
import 'dotenv/config';
import cartScene from './cart.scene';

const stage = new Scenes.Stage([startScene, mainMenuScene, cartScene]);
export default stage;
