import { Telegraf, session, Scenes } from 'telegraf';
import stage from './bot/scenes';
import 'dotenv/config';

const bot = new Telegraf<Scenes.SceneContext>(
  process.env.NX_TELEGRAM_BOT_TOKEN || ''
);

bot.use(session());
bot.use(stage.middleware());

bot.command('start', (ctx) => ctx.scene.enter('start'));

bot.launch();
