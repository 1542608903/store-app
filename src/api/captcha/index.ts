import { api } from 'boot/axios';
import { AxiosResponse } from 'src/types';
export interface ICode {
  codeKey: string;
  code: string
}

async function getCaptcha(): Promise<AxiosResponse<ICode>> {
  return await api.get('/captcha/code');
}

// 导出
export { getCaptcha };
