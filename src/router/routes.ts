import addressRouter from './module/address';
import cartRouter from './module/cart';
import errorRouter from './module/error';
import loginRouter from './module/login';
import orderRouter from './module/order';
import userRouter from './module/user';
import { AppRouteRecordRaw } from 'src/types/router';
// import { IProduct } from 'src/types/product';
const routes: AppRouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '/',
        name: 'Home',
        component: () => import('src/pages/Home.vue'),
        meta: {
          title: '主页',
          icon: 'fa-solid fa-house',
          orderRouter: 1,
          hidden: false,
          requiresAuth: false,
        },
      },
      {
        path: '/detail',
        name: 'ProductDetail',
        component: () => import('src/pages/product/ProductDetail.vue'),
        props: true,
        meta: {
          title: '产品详情',
          hidden: true,
          requiresAuth: false,
        }
      },
      ...cartRouter,
      ...addressRouter,
      ...orderRouter,
      ...userRouter,
      errorRouter,  // 如果是单个路由，不用展开
    ],
  },
  loginRouter,
];

export const getMenus = () => {
  const menus = routes[0].children?.map((item: AppRouteRecordRaw) => {
    return {
      path: item.path,
      title: item.meta?.title,
      icon: item.meta?.icon,
      hidden: item.meta?.hidden,
      // 子路由
      children: item.children?.map((child) => child)
    };
  });
  return menus?.filter((item) => !item.hidden);
};

export default routes;
