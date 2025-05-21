import { DishCategory } from './dish.model';

export interface Menu {
  id: string;
  name: string;
  description?: string;
  categories: DishCategory[];
  createdAt: Date;
  updatedAt?: Date;
}