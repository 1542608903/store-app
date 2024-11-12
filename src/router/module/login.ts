import { RouteRecordRaw } from 'vue-router';
const loginRouter: RouteRecordRaw = {
  path: '/login',
  name: 'Login',
  component: () => import('src/pages/login/Login.vue'),
  meta: {
    requiresAuth: false,
    title: '登录页',
    hidden: false,
  },
};
export default loginRouter;
