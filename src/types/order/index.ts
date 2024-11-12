import { IAddress } from 'src/types/address';
import { IProduct } from 'src/types/product';

export interface IOrder {
  id?: number;
  user_id?: number;
  address_id?: number;
  total_price?: number;
  state?: number;
  order_number?: string;
  createdAt: string;
  updatedAt: string;
  address: IAddress;
  order_items: orderItems[];
}

export interface orderItems {
  id?: number;
  goods_id?: string;
  order_id?: string;
  price?: number;
  quantity?: number;
  created_at: string;
  updated_at: string;
  product: IProduct;
}
