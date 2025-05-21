import { doc, setDoc } from 'firebase/firestore';
import { User, UserRole } from '../../../models/user.model';
import { db } from '../../firebase/firebase';

async function registerUser(user: User): Promise<void> {
  try {
    await setDoc(doc(db, 'users', String(user.telegramId)), {
      username: user.username || '',
      createdAt: user.createdAt || new Date().toISOString(),
      role: user.role || 'user',
      wallet: user.wallet || {
        kisses: 0,
        premium: 0,
        createdAt: new Date().toISOString(),
      },
      state: user.state || null,
      updatedAt: user.updatedAt || null,
    });
    console.log('Пользователь добавлен!');
  } catch (e) {
    console.error('Ошибка при добавлении пользователя:', e);
  }
}

export default registerUser;
