import { RouteRecordRaw } from 'vue-router';

export interface Meta {
  title?: string;
  icon?: string; // icon 是可选的
  orderRouter?: number; // orderMenu 是可选的
  hidden?: boolean;
}

// 定义一个类型来扩展 RouteRecordRaw，并添加自定义 meta 字段
export type AppRouteRecordRaw = RouteRecordRaw & {
  meta?: Meta;
  children?: AppRouteRecordRaw[];
};
