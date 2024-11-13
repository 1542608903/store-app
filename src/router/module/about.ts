import { RouteRecordRaw } from 'vue-router';
const aboutRouter: RouteRecordRaw = {
  path: '/about',
  name: 'About',
  component: () => import('src/pages/about/About.vue'),
  meta: {
    requiresAuth: false,
    title: '关于页',
    hidden: true,
  },
};
export default aboutRouter;
