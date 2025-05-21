export interface Dish {
  id: string;
  photoUrl: string;
  name: string;
  description: string;
  cookingTime: number;
  opinion: string;
  price: number;
  ingredients?: string[];
  category?: number;
  isAvailable?: boolean;
  createdAt?: Date;
}

export interface DishCategory {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
  dishes: Dish[];
}

