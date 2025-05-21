import { doc, setDoc } from 'firebase/firestore';
import { User, UserRole, UserStatePage } from '../../../models/user.model';
import { db } from '../../firebase/firebase';
import { v4 as uuidv4 } from 'uuid';

async function registerUser(user: User): Promise<void> {
  try {
    const generatedId = user.id || uuidv4();

    await setDoc(doc(db, 'users', String(user.telegramId)), {
      id: generatedId,
      username: user.username || '',
      createdAt: user.createdAt || new Date().toISOString(),
      role: user.role || UserRole.GUEST,
      wallet: user.wallet || {
        kisses: 0,
        premium: 0,
        createdAt: new Date().toISOString(),
      },
      state: user.state || {
        currentPage: UserStatePage.START,
        previousPage: UserStatePage.START,
        cart: {
          dishes: [],
          totalPrice: { kisses: 0, premium: 0 },
        },
      },
      updatedAt: user.updatedAt || null,
    });
  } catch (e) {
    console.error('Ошибка при добавлении пользователя:', e);
  }
}

export default registerUser;
