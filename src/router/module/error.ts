import { RouteRecordRaw } from 'vue-router';

const errorRouter: RouteRecordRaw = {
  path: '/:catchAll(.*)*',
  name: '404',
  component: () => import('src/pages/error/Error.vue'),
  meta: {
    title: '404',
    icon: '404',
    hidden: true,
  },
};
export default errorRouter;
