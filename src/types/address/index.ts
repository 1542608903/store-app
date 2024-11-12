export interface IAddress {
  consignee: string;
  phone: string;
  address: string;
  is_default?: boolean;
  id?: number;
  user_id?: number;
}

export interface IArea {
  id: number;
  name: string;
  children?: IArea[];
}
