import { Component } from 'vue';
export interface Meta {
  title: string;
  icon?: string;  // icon 是可选的
  orderMenu?: number;  // orderMenu 是可选的
}

// 定义路由配置类型
export interface PageConfig<T> {
  default: {
    [key: string]: T; // 根据你的实际需要，调整 `meta` 的类型
  };
}

export interface Route {
  path: string;
  name: string;
  component: Component;
  meta: PageConfig<Meta>['default'];
  children?: Route[];
}
