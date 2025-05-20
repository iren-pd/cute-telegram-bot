import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { User } from '../../../models/user.model';

export async function updateUser(
  userId: string,
  data: Partial<User>
): Promise<boolean> {
  try {
    await updateDoc(doc(db, 'users', userId), data);
    console.log('Пользователь обновлён!');
    return true;
  } catch (e) {
    console.error('Ошибка при обновлении пользователя:', e);
    return false;
  }
}

export default updateUser;
