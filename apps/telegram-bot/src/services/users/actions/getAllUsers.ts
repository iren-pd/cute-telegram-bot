import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { User } from '../../../models/user.model';

export async function getAllUsers(): Promise<User[]> {
  try {
    const usersCollection = collection(db, 'users');
    const querySnapshot = await getDocs(usersCollection);

    const users: User[] = [];
    querySnapshot.forEach((doc) => {
      const user = doc.data() as User;
      (user as any).telegramId = doc.id;
      users.push(user);
    });

    return users;
  } catch (error) {
    console.error('Ошибка при получении пользователей:', error);
    return [];
  }
}

export default getAllUsers;
