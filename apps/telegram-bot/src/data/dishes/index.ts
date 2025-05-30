import { dishesBreakfast } from './dishesBreakfast';
import { dishesLunch } from './dishesLunch';
import { dishesSalad } from './dishesSalad';
import { dishesBeerDish } from './dishesBeerDish';
import { dishesDessert } from './dishesDessert';

export const dishes = [
  ...dishesBreakfast,
  ...dishesLunch,
  ...dishesSalad,
  ...dishesDessert,
  ...dishesBeerDish,
];
