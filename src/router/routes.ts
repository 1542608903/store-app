import { RouteRecordRaw } from 'vue-router';

export const generateRoutes = () => {
  const pages = import.meta.globEager('../pages/**/page.js');
  const pageComps = import.meta.glob('../pages/**/index.vue');
  return Object.entries(pages).map(([path, congfig]) => {
    const pageJs = path
    path = path.replace('../pages', '').replace('/page.js', '');
    path = path === '' ? '/' : path;
    const name = path.split('/').filter(Boolean).join('-') || 'index';
    const compPath = pageJs.replace('page.js', 'index.vue');
    return {
      path: path,
      name,
      component: pageComps[compPath],
      meta: congfig.default,
    }
  })
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: generateRoutes(),
  },
  {
    path: '/:catchAll(.*)*',
    name: '404',
    component: () => import('pages/error/index.vue'),
    meta: {
      title: '404',
      icon: '404'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('pages/login/index.vue'),
    meta: {
      requiresAuth: false,
      title: '登录页',
    }
  },
];



export default routes;
