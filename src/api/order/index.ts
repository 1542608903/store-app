import { api } from 'boot/axios';
import type { Product } from 'src/types/product';
import { AxiosResponse, Result } from 'src/types';
import { IOrder } from 'src/types/order';

/**
 * 创建订单
 * @param data 订单数据
 * @returns {Promise<IOrder>}
 * */
async function createOrder(
  data: Product[]
): Promise<AxiosResponse<IOrder>> {
  return api.post('/order/create', { data });
}

/**
 * 获取订单列表
 * @param pageNum
 * @param pageSize
 * @returns
 * */
async function getOrder(
  pageNum: number = 1,
  pageSize: number = 5
): Promise<AxiosResponse<Result<IOrder[]>>> {
  return api.post('/order', { pageNum, pageSize });
}


/**
 * 根据id获取订单详情
 * @param id 订单id
 * @returns {Promise<IOrder>}
 * */
async function getOrderById(
  id: number
): Promise<AxiosResponse<IOrder>> {
  return await api.get(`/order/${id}`);
}

/**
 * 更新订单状态
 * @param id 订单id
 * @returns {Promise<IOrder>}
 * */
async function orderStateUpdateById(
  id: number | string
): Promise<AxiosResponse<IOrder>> {
  return await api.patch(`/order/${id}`);
}

// 导出
export { createOrder, getOrder, getOrderById, orderStateUpdateById };
