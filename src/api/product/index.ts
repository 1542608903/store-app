import { api } from 'boot/axios';
// 导入ts类型
import { IProduct } from 'src/types/product';
import { AxiosResponse, Result } from 'src/types';
async function getProducts(pageNum: number = 1, pageSize: number = 10): Promise<AxiosResponse<Result<IProduct[]>>> {
  return await api.get('/goods', { params: { pageNum, pageSize } })
}
async function getSearch(value: string): Promise<AxiosResponse<Result<IProduct[]>>> {
  return await api.get(`/goods/search?name=${value}`)
}
// 导出
export { getProducts, getSearch }
