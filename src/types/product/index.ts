export interface IProduct {
  id: number;
  goods_name: string;
  goods_price: number;
  goods_num: number;
  goods_img: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export type Product = {
  id: number;
  goods_price: number;
  quantity: number;
  addressId: number;
  total: number;
};
