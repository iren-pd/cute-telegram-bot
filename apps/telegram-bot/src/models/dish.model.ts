export enum DishOpinion {
  EXCELLENT = '⭐️⭐️⭐️⭐️⭐️',
  VERY_GOOD = '⭐️⭐️⭐️⭐️',
  GOOD = '⭐️⭐️⭐️',
  FAIR = '⭐️⭐️',
  POOR = '⭐️',
  BAD = '💩',
}

export enum Currency {
  KISSES = 'поцелуйчиков',
  PREMIUM = 'премиум',
}

export interface Dish {
  id: string;
  photoSrc: string;
  name: string;
  description: string;
  cookingTime: number;
  opinion: DishOpinion;
  price: number;
  currency: Currency.KISSES;
  category: number;
  options?: string[];
  createdAt: Date;
}

export enum DishCategoryName {
  BREAKFAST = '🍳 Завтрак',
  LUNCH = '🍲 Обед',
  SALAD = '🥗 Салат',
  DESSERT = '🍰 Сладенькое',
  BEERDISH = '🍻 Пивная тарелка',
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
