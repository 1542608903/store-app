import { api } from 'boot/axios';
// 导入ts类型
import { IProduct } from 'src/types/product';
import { AxiosResponse, Result } from 'src/types';

/**
 * 获取商品列表
 * @param pageNum 页码
 * @param pageSize 每页条数
 */
async function getProducts(
  pageNum: number = 1,
  pageSize: number = 10
): Promise<AxiosResponse<Result<IProduct[]>>> {
  return await api.get('/goods', { params: { pageNum, pageSize } });
}

/**
 * 搜索商品
 * @param value 搜索关键字
 * @param limit 返回条数
 * */
async function getSearch(
  value: string,
  limit: number = 5
): Promise<AxiosResponse<Result<IProduct[]>>> {
  // return await api.get(`/goods/search_goods?name=${value}&limit=${limit}`)
  return await api.get('/goods/search_goods', { params: { name: value, limit } });
}


/**
 * 根据id获取商品
 * @param id 商品id
 * @returns 商品信息
 * */
async function getProductById(id: number) {
  return await api.get(`/goods/${id}`);
}

// 导出
export { getProducts, getSearch, getProductById };
