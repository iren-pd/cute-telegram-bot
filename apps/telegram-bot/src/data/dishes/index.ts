import { dishesBreakfast } from './dishesBreakfast';
import { dishesLunch } from './dishesLunch';
import { dishesSalad } from './dishesSalad';
import { dishesBeerDish } from './dishesBeerDish';

export const dishes = [...dishesBreakfast, ...dishesLunch, ...dishesSalad, ...dishesBeerDish];
