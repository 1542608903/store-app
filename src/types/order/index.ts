import { IAddress } from 'src/types/address';
import { IProduct } from 'src/types/product';

export interface IOrder {
  id: string
  user_id: string
  address_id: string
  total_price: number
  status: number
  order_number: string
  created_at: string
  updated_at: string
  address: IAddress
  order_items: orderItems[]
}

export interface orderItems {
  id: string
  goods_id: string
  order_id: string
  price: number
  quantity: number
  created_at: string
  updated_at: string
  good: IProduct
}


export interface IOrderResponse {
  result: IOrder[]
}
