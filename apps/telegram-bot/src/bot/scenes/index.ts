import { Scenes } from 'telegraf';
import startScene from './start.scene';
import mainMenuScene from './main_menu.scene';
import 'dotenv/config';

const stage = new Scenes.Stage([startScene, mainMenuScene]);
export default stage;
