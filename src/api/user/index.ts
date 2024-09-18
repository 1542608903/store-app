import { api } from 'boot/axios';
import type { loginData, changePassword, IUser } from 'src/types/user'
import { IAxiosResponse, AxiosResponse, Result } from 'src/types';

// 注册接口
async function register(data: loginData): Promise<IAxiosResponse> {
  return await api.post('/user/register', data);
}

async function login(data: loginData): Promise<AxiosResponse<Result<IUser>>> {
  const { user_name, password } = data
  return await api.post('/user/login', { user_name, password });
}

async function changePassword(data: changePassword) {
  return await api.patch('/user/change-password', data);
}
// 导出
export { login, register, changePassword }
