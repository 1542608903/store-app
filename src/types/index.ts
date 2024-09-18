import { IUser } from './user';
import { IProduct } from './product';
import { IAddress } from 'src/types/address';
// import { IOrder } from 'src/types/order';
export interface IAxiosResponse {
  code: number;
  message: string;
  result: IResult;
}

export interface IResult {
  order?: object,
  list?: IProduct[]
  user?: IUser
  address?: IAddress
  addressList?: IAddress[]
  accessToken?: string
  rfreshToken?: string
}

export interface AxiosResponse<T> {
  code: number;
  message: string;
  result?: Result<T> | T;
}

export interface Result<T> {
  order?: T,
  list?: T
  user?: IUser
  address?: T
  accessToken?: string
  rfreshToken?: string
  pageNum?: number;
  pageSize?: number;
  total?: number;
}
