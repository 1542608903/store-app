import { RouteRecordRaw } from 'vue-router';

const orderRouter: RouteRecordRaw[] = [
  {
    path: '/order',
    name: 'Order',
    component: () => import('src/pages/order/Order.vue'),
    meta: {
      title: '订单',
      icon: 'fa-regular fa-file-lines',
      orderRouter: 2,
      hidden: false,
      requiresAuth: true,
    },
  },
  {
    path: '/order-detail/:id',
    name: 'OrderDetail',
    component: () => import('src/pages/order/OrderDetail.vue'),
    meta: {
      title: '订单项',
      icon: 'fa-regular fa-file-lines',
      hidden: true,
      requiresAuth: true,
    },
  },
];

export default orderRouter;
