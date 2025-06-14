import { Scenes } from 'telegraf';
import { UserRole, UserStatePage } from '../../models/user.model';
import getUser from '../../services/users/actions/getUser';
import renderScreen from '../../utils/renderScreen';
import { getAdminPanelKeyboard } from '../keyboards/admin/adminPanelKeyboard';
import getAllUsers from '../../services/users/actions/getAllUsers';
import { OrderStatus } from '../../models/order.model';

const adminPanelScene = new Scenes.BaseScene<Scenes.SceneContext>(
  'admin_panel'
);

adminPanelScene.enter(async (ctx) => {
  const telegramId = ctx.from?.id;

  if (!telegramId) {
    await ctx.reply('Ошибка: не удалось получить данные пользователя.');
    return ctx.scene.leave();
  }

  const admin = await getUser(String(telegramId));
  if (!admin || admin.role !== UserRole.ADMIN) {
    await ctx.reply('У вас нет доступа к панели администратора.');
    return ctx.scene.leave();
  }

  const messageText =
    'Добро пожаловать в панель администратора!\n\nНажмите "Обновить заказы" для просмотра активных заказов.';
  const keyboard = getAdminPanelKeyboard();

  await renderScreen(
    ctx,
    messageText,
    UserRole.ADMIN,
    UserStatePage.ADMIN_PANEL,
    admin.state,
    keyboard
  );
});

adminPanelScene.action('refresh_orders', async (ctx) => {
  const users = await getAllUsers();
  const activeOrder = users.find((user) => {
    return (
      user.state.cart.status !== OrderStatus.NO_STATUS &&
      user.state.cart.dishes.length > 0
    );
  });

  if (activeOrder) {
    await ctx.scene.enter('admin_order', { userId: String(activeOrder.telegramId) });
  } else {
    await ctx.reply('Активных заказов нет.');
  }
});

export default adminPanelScene;
