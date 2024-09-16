import { api } from 'boot/axios';
import { IProductInfo } from 'src/types/product'
import { IAxiosResponse } from 'src/types';
import { IOrderResponse } from 'src/types/order';

async function createOrder(data: IProductInfo[], id: string, total: number): Promise<IAxiosResponse> {
  return api.post('/order/create', { id, total, data })
}

async function getOrder(): Promise<IOrderResponse> {
  return api.post('/order')
}

// 导出
export { createOrder, getOrder }
