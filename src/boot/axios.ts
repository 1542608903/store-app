import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance, AxiosError } from 'axios';
import { getToken } from 'src/utils/saveToken';


declare module 'vue' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

const api = axios.create({
  baseURL: process.env.API_BASE_URL || '/api',
});

// 响应拦截器
api.interceptors.response.use(
  function (response) {
    const data = response.data;
    return data;
  },
  function (error: AxiosError) {
    return Promise.reject(error);
  }
);

// 请求拦截器
api.interceptors.request.use(
  function (config) {
    const token = getToken('accessToken');
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default boot(({ app }) => {
  app.config.globalProperties.$api = api;
});

export { api };
