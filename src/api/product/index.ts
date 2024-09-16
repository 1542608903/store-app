import { api } from 'boot/axios';
// 导入ts类型
import { IProductResponse } from 'src/types/product';

async function getProducts(pageNum: number = 1, pageSize: number = 10): Promise<IProductResponse> {
  return await api.get('/goods', { params: { pageNum, pageSize } })
}
async function getSearch(value: string): Promise<IProductResponse> {
  return await api.get(`/goods/search?name=${value}`)
}
// 导出
export { getProducts, getSearch }
