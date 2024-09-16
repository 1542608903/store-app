export interface IProduct {
  id: string;
  goods_name: string;
  goods_price: number;
  goods_num: number;
  goods_img: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  // 是否选中 默认选中
  checked?: boolean;
}

export interface IProductResponse {
  result: {
    list: IProduct[];
  };
}

export interface IProductInfo {
  id: string;
  goods_price: number;
  quantity: number;
}
