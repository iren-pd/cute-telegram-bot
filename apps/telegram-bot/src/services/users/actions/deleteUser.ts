import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

export async function deleteUser(userId: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, 'users', userId));
    console.log('Пользователь удалён!');
    return true;
  } catch (e) {
    console.error('Ошибка при удалении пользователя:', e);
    return false;
  }
}

export default deleteUser;
