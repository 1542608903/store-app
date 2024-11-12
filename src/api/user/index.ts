import { api } from 'boot/axios';
import type {
  loginData,
  IUser,
  userForm,
} from 'src/types/user';
import { AxiosResponse, Result } from 'src/types';

// 注册接口
async function register(
  data: loginData
): Promise<AxiosResponse<Result<IUser>>> {
  return await api.post('/user/register', data);
}
// 登录接口
/**
 *
 * @param data user_name, password, codeKey, code
 * @returns
 */
async function login(user_name: string, password: string, codeKey: string, code: string): Promise<AxiosResponse<Result<IUser>>> {
  return await api.post('/user/login', { user_name, password, codeKey, code });
}
// 修改密码接口
async function updatePassword(
  data: userForm
): Promise<AxiosResponse<Result<boolean>>> {
  return await api.patch('/user/change-password', data);
}
// 修改用户修改
async function userEdit(data: userForm): Promise<AxiosResponse<Result<IUser>>> {
  return await api.patch('/user/change-user', data);
}

// 导出
export { login, register, updatePassword, userEdit };
