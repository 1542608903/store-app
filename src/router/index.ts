import { route } from 'quasar/wrappers';
import { RouteLocationNormalized, NavigationGuardNext } from 'vue-router';

import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';

import routes from './routes';

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  // 全局路由守卫
  const whiteList = ['/login', '/', '/detail']; // 白名单路由


  // 添加全局路由守卫
  Router.beforeEach(
    async (
      to: RouteLocationNormalized,
      from: RouteLocationNormalized,
      next: NavigationGuardNext
    ) => {
      try {
        // 白名单中的路由直接放行
        if (whiteList.includes(to.path)) {
          next(); // 继续导航
          return;
        }

        const userString = localStorage.getItem('user');
        let isLogin: boolean = false;

        if (userString) {
          const user = JSON.parse(userString);
          isLogin = user.isLogin;
        }
        // 如果用户未登录，跳转到登录页面，并传递重定向目标
        if (!isLogin) {
          next({
            path: '/',
            query: { redirect: to.fullPath }, // 将原始路径保存在 query 中，以便登录后跳转
          });
          return;
        }
        // 已登录，继续导航
        next();
      } catch (error) {
        next(false); // 中断导航
        throw error;
      }
    }
  );

  return Router;
});
