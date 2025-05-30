import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';

export async function getCategoryDescription(categoryId: number | string): Promise<string> {
  const docRef = doc(db, 'categories', String(categoryId));
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return '';
  }

  const data = docSnap.data();
  return data?.description || '';
}

export default getCategoryDescription;