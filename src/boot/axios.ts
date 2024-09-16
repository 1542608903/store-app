import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';
import { getToken, removeToken } from 'src/utils/saveToken';
import { useUserStore } from 'src/stores/user-store';
import { useAddressStore } from 'src/stores/address-store';
import { useCartStore } from 'src/stores/cart-store';

import { Notify } from 'quasar';

declare module 'vue' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

const userStore = useUserStore();
const addressStore = useAddressStore();
const cartStore = useCartStore();

const api = axios.create({
  baseURL: '/api'
});

// 响应拦截器
api.interceptors.response.use(function (response) {

  return response.data;
}, function (error) {

  if (error.response.data.code === '10101') {
    Notify.create({
      message: '登录过期, 请重新登录',
      color: 'red',
      position: 'top',
    })
    // 清除用户信息
    userStore.clearUserInfo();
    // 清除用户地址
    addressStore.clearAddress();
    // 清除购物车
    cartStore.clearCart();
    // 清除token
    removeToken('accessToken');
    removeToken('rfreshToken');
  }
  return error.response.data;
});

// 请求拦截器
api.interceptors.request.use(function (config) {
  config.headers.Authorization = getToken('accessToken');
  return config;
}, function (error) {

  return error;
})
export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api };
