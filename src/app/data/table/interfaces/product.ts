import {Category} from '../../categories/interfaces/category';

export interface Product {
  id: number;
  name: string;
  quantityBuy: number;
  costPrice: number;
  category: Category;
  checked?: boolean;
}
