import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { DishCategory } from '../../models/dish.model';

export async function getCategories(): Promise<DishCategory[]> {
  const categoriesCol = collection(db, 'categories');
  const categoriesSnapshot = await getDocs(categoriesCol);
  return categoriesSnapshot.docs.map((doc) => doc.data() as DishCategory);
}

export default getCategories;
