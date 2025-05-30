import { Currency, Dish, DishOpinion } from '../../models/dish.model';

export const dishesBeerDish: Dish[] = [
  {
    id: '4_1',
    photoSrc: 'src/assets/dishesBeerDish/4_1.jpg',
    name: '🧀 Сыр сулугуни',
    description: '🧀 Традиционный грузинский сыр, идеально подходит к пиву',
    cookingTime: 0,
    opinion: DishOpinion.EXCELLENT,
    price: 6,
    currency: Currency.KISSES,
    category: 5,
    createdAt: new Date(),
  },
  {
    id: '4_2',
    photoSrc: 'src/assets/dishesBeerDish/4_2.jpg',
    name: '🧀 Ассорти из сыров',
    description: '🧀 Ассорти из различных сыров, отличная закуска к пиву',
    cookingTime: 0,
    opinion: DishOpinion.VERY_GOOD,
    price: 8,
    currency: Currency.KISSES,
    category: 5,
    options: ['🧀 Гауда', '🧀 Чеддер', '🧀 Бри', '🧀 Моцарелла', '🧀 Пармезан'],
    createdAt: new Date(),
  },
  {
    id: '4_3',
    photoSrc: 'src/assets/dishesBeerDish/4_3.jpg',
    name: '🍖 Кабаносы',
    description: '🍖 Копченые колбаски, отличная закуска к пиву',
    cookingTime: 0,
    opinion: DishOpinion.GOOD,
    price: 5,
    currency: Currency.KISSES,
    category: 5,
    createdAt: new Date(),
  },
  {
    id: '4_4',
    photoSrc: 'src/assets/dishesBeerDish/4_4.jpg',
    name: '🍟 Чипсы',
    description: '🍟 Хрустящие чипсы с различными вкусами',
    cookingTime: 0,
    opinion: DishOpinion.VERY_GOOD,
    price: 5,
    currency: Currency.KISSES,
    category: 5,
    createdAt: new Date(),
  },
  {
    id: '4_5',
    photoSrc: 'src/assets/dishesBeerDish/4_5.jpg',
    name: '🍟 Пелеты',
    description: '🍟 Хрустящие пелеты, отличная закуска к пиву',
    cookingTime: 0,
    opinion: DishOpinion.VERY_GOOD,
    price: 5,
    currency: Currency.KISSES,
    category: 5,
    options: ['🧀 Сыр', '🌶️ Васаби', '🥓 Бекон'],
    createdAt: new Date(),
  },
  {
    id: '4_6',
    photoSrc: 'src/assets/dishesBeerDish/4_6.jpg',
    name: '🍗 Курица вяленая',
    description: '🍗 Вяленая курица с насыщенным вкусом и ароматом',
    cookingTime: 0,
    opinion: DishOpinion.VERY_GOOD,
    price: 7,
    currency: Currency.KISSES,
    category: 5,
    createdAt: new Date(),
  },
  {
    id: '4_7',
    photoSrc: 'src/assets/dishesBeerDish/4_7.jpg',
    name: '🐟 Таранка',
    description: '🐟 Сушеная рыба, отличная закуска к пиву',
    cookingTime: 0,
    opinion: DishOpinion.GOOD,
    price: 4,
    currency: Currency.KISSES,
    category: 5,
    createdAt: new Date(),
  },
  {
    id: '4_8',
    photoSrc: 'src/assets/dishesBeerDish/4_8.jpg',
    name: '🐟 Путасу',
    description: '🐟 Сушеная путасу с насыщенным вкусом и ароматом',
    cookingTime: 0,
    opinion: DishOpinion.GOOD,
    price: 4,
    currency: Currency.KISSES,
    category: 5,
    createdAt: new Date(),
  },
  {
    id: '4_9',
    photoSrc: 'src/assets/dishesBeerDish/4_9.jpg',
    name: '🥖 Сухарики',
    description: '🥖 Сухарики с различными вкусами, отличная закуска к пиву',
    cookingTime: 0,
    opinion: DishOpinion.VERY_GOOD,
    price: 5,
    currency: Currency.KISSES,
    category: 5,
    options: ['🍅 С томатами', '🧀 С сыром', '🧄 С чесноком', '🌶️ С паприкой'],
    createdAt: new Date(),
  },
  {
    id: '4_10',
    photoSrc: 'src/assets/dishesBeerDish/4_10.jpg',
    name: '🥜 Орехи',
    description: '🥜 Смесь орехов, идеально подходит к пиву',
    cookingTime: 0,
    opinion: DishOpinion.VERY_GOOD,
    price: 10,
    currency: Currency.KISSES,
    category: 5,
    options: ['🥜 Арахис', '🥜 Миндаль', '🥜 Кешью', '🥜 Фисташки'],
    createdAt: new Date(),
  },
  {
    id: '4_11',
    photoSrc: 'src/assets/dishesBeerDish/4_11.jpg',
    name: '🦑 Кальмар',
    description: '🦑 Кальмар, отличная закуска к пиву',
    cookingTime: 0,
    opinion: DishOpinion.VERY_GOOD,
    price: 9,
    currency: Currency.KISSES,
    category: 5,
    options: ['🦑 Кольца кальмара', '🦑 Перуанский кальмар'],
    createdAt: new Date(),
  },
];
