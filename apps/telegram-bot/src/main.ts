import { Telegraf, session, Scenes } from 'telegraf';
import stage from './bot/scenes';

const bot = new Telegraf<Scenes.SceneContext>(
  process.env.TELEGRAM_BOT_TOKEN || ''
);

bot.use(session());
bot.use(stage.middleware());

bot.command('start', (ctx) => ctx.scene.enter('start'));

bot.launch();
