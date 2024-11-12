import { RouteRecordRaw } from 'vue-router';
const cartRouter: RouteRecordRaw[] = [
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('src/pages/cart/Cart.vue'),
    meta: {
      title: '购物车',
      icon: 'fa-solid fa-cart-shopping',
      orderRouter: 3,
      hidden: false,
      requiresAuth: true,
    },
  },
];

export default cartRouter;
