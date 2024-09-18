import { api } from 'boot/axios';
import { IProductInfo } from 'src/types/product'
import { AxiosResponse, Result } from 'src/types';
import { IOrder } from 'src/types/order';

async function createOrder(data: IProductInfo[], id: string, total: number): Promise<AxiosResponse<Result<IOrder>>> {
  return api.post('/order/create', { id, total, data })
}

async function getOrder(): Promise<AxiosResponse<Result<IOrder[]>>> {
  return api.post('/order')
}
async function getOrderById(id: string): Promise<AxiosResponse<Result<IOrder>>> {
  return await api.get(`/order/${id}`)
}
// 导出
export { createOrder, getOrder, getOrderById }
