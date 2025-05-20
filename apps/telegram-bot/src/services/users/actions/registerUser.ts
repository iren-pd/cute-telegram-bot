import { doc, setDoc } from 'firebase/firestore';
import { User, UserRole } from '../../../models/user.model';
import { db } from '../../firebase/firebase';

async function registerUser(user: User): Promise<void> {
  try {
    await setDoc(doc(db, 'users', user.telegram_uid), {
      nickname: user.nickname || '',
      createdAt: user.createdAt,
      role: user.role || UserRole.GUEST,
      wallet: user.wallet || { kisses: 0, hugs: 0, createdAt: new Date() },
    });
    console.log('Пользователь добавлен!');
  } catch (e) {
    console.error('Ошибка при добавлении пользователя:', e);
  }
}

export default registerUser;