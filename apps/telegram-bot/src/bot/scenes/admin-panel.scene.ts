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
  console.log('telegramId', telegramId);
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
  console.log('users', users);
  const activeOrder = users.find(
    (user) => {
      // console.log('user', user.state.cart);
      return (
        user.state.cart.status !== OrderStatus.NO_STATUS &&
        user.state.cart.dishes.length > 0
      );
    }
  );

  // console.log('activeOrder', activeOrder?.state.cart);

  if (activeOrder) {
    await ctx.scene.enter('admin_order', { userId: activeOrder.telegramId });
  } else {
    await ctx.reply('Активных заказов нет.');
  }
});

adminPanelScene.action('show_statistics', async (ctx) => {
  await ctx.reply('Статистика будет доступна в следующем обновлении.');
});

export default adminPanelScene;
