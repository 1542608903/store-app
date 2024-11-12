import { RouteRecordRaw } from 'vue-router';

const userRouter: RouteRecordRaw[] = [
  {
    path: '/user',
    name: 'User',
    component: () => import('src/pages/user/UserCenter.vue'),
    meta: {
      title: '个人中心',
      icon: 'fa-regular fa-user',
      orderRouter: 4,
      hidden: false,
      requiresAuth: true,
    },
    children: [],
  },
  {
    path: '/user-edit',
    name: 'UserEdit',
    component: () => import('src/pages/user/UserEdit.vue'),
    meta: {
      title: '用户编辑',
      icon: 'fa-regular fa-user',
      orderRouter: 4,
      hidden: true,
      requiresAuth: true,
    },
    children: [],
  },
];

export default userRouter;
