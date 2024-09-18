import { api } from 'boot/axios';
import { IAddress } from 'src/types/address';
import { IAxiosResponse, AxiosResponse, Result } from 'src/types';

async function createAddress(data: IAddress): Promise<AxiosResponse<Result<IAddress[]>>> {
  return await api.post('/address', data);
}
async function getAddress(): Promise<AxiosResponse<Result<IAddress[]>>> {
  return await api.post('/address/findAll')
}
async function updateDefault(id: string, is_default: boolean): Promise<AxiosResponse<Result<IAddress[]>>> {

  return await api.post('/address/update_default', { id, is_default })
}

async function deleteAddress(id: string): Promise<IAxiosResponse> {
  return await api.delete(`/address/${id}`)
}
// 导出
export { createAddress, getAddress, updateDefault, deleteAddress, }
