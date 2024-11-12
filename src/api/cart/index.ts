import { api } from 'boot/axios';
import { AxiosResponse, Result } from 'src/types';
import { ICartItem } from 'src/types/cart';

export async function createCart(
  id: number
): Promise<AxiosResponse<Result<ICartItem>>> {
  return await api.post('/cart/add', { goods_id: +id });
}

export async function getCartList(
  pageNum: number,
  pageSize: number
): Promise<AxiosResponse<Result<ICartItem[]>>> {
  return await api.get('/cart', { params: { pageNum, pageSize } });
}

export async function checkeAllCart(
  isSelect: boolean
): Promise<AxiosResponse<Array<number>>> {
  return await api.post('/cart/selectAll', { isSelect });
}

export async function updateOneChecke(
  id: number,
  selected: boolean
): Promise<AxiosResponse<Array<number>>> {
  return api.patch(`/cart/check/${id}`, { selected });
}

export async function updateOneNumber(
  id: number,
  number: number
): Promise<AxiosResponse<Array<number>>> {
  return api.patch(`/cart/number/${id}`, { number });
}

export async function removes(
  ids: Array<number>
): Promise<AxiosResponse<Array<number>>> {
  return await api.post('/cart/remove', ids);
}
