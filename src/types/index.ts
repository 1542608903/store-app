import { IUser } from './user';
import { IProduct } from './product';
import { IAddress } from 'src/types/address';

export interface IAxiosResponse {
  code: number;
  message: string;
  result: IResult;
}

export type IResult = {
  order?: object,
  list?: IProduct[]
  user?: IUser
  address?: IAddress
  addressList?: IAddress[]
  accessToken?: string
  rfreshToken?: string

}
