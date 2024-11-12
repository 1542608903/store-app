import { RouteRecordRaw } from 'vue-router';

const productRouter: RouteRecordRaw[] = [
  {
    path: '/home',
    name: 'Home',
    component: () => import('src/pages/Home.vue'),
    meta: {
      title: '主页',
      icon: 'fa-solid fa-house',
      orderRouter: 1,
      hidden: false,
    },
    children: [
      {
        path: 'detail/:id',
        component: () => import('src/pages/product/ProductDetail.vue')
      }
    ]
  },
];

export default productRouter;
