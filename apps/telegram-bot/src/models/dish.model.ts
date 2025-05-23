export enum DishOpinion {
  EXCELLENT = '⭐️⭐️⭐️⭐️⭐️',
  VERY_GOOD = '⭐️⭐️⭐️⭐️',
  GOOD = '⭐️⭐️⭐️',
  FAIR = '⭐️⭐️',
  POOR = '⭐️',
  BAD = '💩',
}

export interface Dish {
  id: string;
  photoUrl: string;
  name: string;
  description: string;
  cookingTime: number;
  opinion: DishOpinion;
  price: number;
  category: number;
  options?: string[];
  createdAt: Date;
}

export enum DishCategoryName {
  BREAKFAST = '🍳 Завтрак',
  LUNCH = '🍲 Обед',
  SALAD = '🥗 Салат',
  DESSERT = '🍰 Сладенькое',
  PREMIUM = '💎 Премиум',
}

export interface DishCategory {
  id: number;
  name: DishCategoryName;
  description?: string;
  createdAt: string;
  updatedAt?: string;
  dishes: Dish[];
}
