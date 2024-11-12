import { RouteRecordRaw } from 'vue-router';
const addressRouter: RouteRecordRaw[] = [
  {
    path: '/address',
    name: 'Address',
    component: () => import('src/pages/address/Address.vue'),
    meta: {
      title: '添加收货地址',
      icon: 'fa-solid fa-address-book',
      orderRouter: 6,
      hidden: true,
      requiresAuth: true,
    },
  },
];
export default addressRouter;
