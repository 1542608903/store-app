import { api } from 'boot/axios';
import { AxiosResponse, Result } from 'src/types';
import { ICartItem } from 'src/types/cart';


export async function createCart(goods_id: string, goods_num: number): Promise<AxiosResponse<Result<ICartItem>>> {
  return await api.post('/cart/add', { goods_id, goods_num })
}
export async function getCartList(): Promise<AxiosResponse<Result<ICartItem[]>>> {
  return await api.get('/cart');
}

export async function deleteCart(id: string): Promise<AxiosResponse<number>> {
  return await api.delete(`/cart/${id}`)
}

export async function updateCart(id: string, goods_num: number): Promise<AxiosResponse<Array<number>>> {
  return await api.put(`/cart/${id}`, { goods_num })
}

export async function selectAllCart(): Promise<AxiosResponse<Array<number>>> {
  return await api.post('/cart/selectAll')
}
export async function unSelectAllCart(): Promise<AxiosResponse<Array<number>>> {
  return await api.post('/cart/unSelectAll')
}
export async function selectOneCart(id: number, data: object): Promise<AxiosResponse<Array<number>>> {
  return api.patch(`/cart/${id}`, data)
}
export async function removeCart(ids: Array<number>) {


  return await api.post('/cart/remove', ids)
}
