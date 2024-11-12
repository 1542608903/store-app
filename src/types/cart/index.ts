import { IProduct } from '../product';

export interface ICartItem {
  id: number;
  user_id: number;
  goods_id: number;
  number: number;
  selected: boolean;
  createdAt: string;
  updatedAt: string;
  product: IProduct;
}

export interface cartItemsID {
  ids: number[];
}
