import { api } from 'boot/axios';
import { loginData } from 'src/types/user'
import { IAxiosResponse } from 'src/types';

// 注册接口
async function register(data: loginData): Promise<IAxiosResponse> {
  return await api.post('/user/register', data);
}

async function login(data: loginData): Promise<IAxiosResponse> {
  const { user_name, password } = data
  return await api.post('/user/login', { user_name, password });
}

// 导出
export { login, register }
