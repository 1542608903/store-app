import { api } from 'boot/axios';
import { IAddress, IArea } from 'src/types/address';
import { AxiosResponse, Result } from 'src/types';

async function createAddress(
  data: IAddress
): Promise<AxiosResponse<IAddress>> {
  return await api.post('/address', data);
}

async function getAddress(): Promise<AxiosResponse<Result<IAddress[]>>> {
  return await api.post('/address/findAll');
}

async function updateDefault(
  id: number
): Promise<AxiosResponse<Result<IAddress[]>>> {
  return await api.post('/address/update_default', { id });
}

async function deleteAddress(
  id: number
): Promise<AxiosResponse<Result<number>>> {
  return await api.delete(`/address/${id}`);
}

async function updateAddress(data: IAddress): Promise<AxiosResponse<Result<IAddress>>> {
  return await api.post('/address/edit', data);
}

async function queryAddress(): Promise<AxiosResponse<IAddress>> {
  return await api.get('/address/query');
}

async function getArea(): Promise<AxiosResponse<Result<IArea[]>>> {
  return await api.get('/address/areas');
}

async function getNewArea() {
  return await api.get('https://passer-by.com/data_location/list.json')
}
// 导出
export {
  createAddress,
  getAddress,
  updateDefault,
  deleteAddress,
  updateAddress,
  queryAddress,
  getArea,
  getNewArea
};
