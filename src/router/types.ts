import type { RouteRecordRaw, RouteMeta } from "vue-router";
import { defineComponent } from "vue";

// 声明.vue文件组件导出的类型：普通组件和异步组件
export type Component<T = any> = ReturnType<typeof defineComponent> | (() => Promise<typeof import("*.vue")>) | (() => Promise<T>);

// 重新声明路由原信息的类型
export interface AppRouteRecordRaw extends Omit<RouteRecordRaw, "meta" | "children"> {
    name: string;
    meta: RouteMeta;
    component?: Component | string;
    components?: Component;
    children?: AppRouteRecordRaw[];
    props?: Recordable;
    fullPath?: string;
}
