import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { User } from '../../../models/user.model';

export async function getUser(userId: string): Promise<User | null> {
  const docRef = doc(db, 'users', userId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data() as User;
  }
  console.log('Пользователь не найден');
  return null;
}

export default getUser;
