import { api } from 'boot/axios';
import { AxiosResponse, Result } from 'src/types';

async function upload(file: FormData): Promise<AxiosResponse<Result<null>>> {
  return await api.post('/upload', file);
}

export {
  upload
}
