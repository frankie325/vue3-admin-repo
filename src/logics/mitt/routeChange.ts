/**
 * Used to monitor routing changes to change the status of menus and tabs. There is no need to monitor the route, because the route status change is affected by the page rendering time, which will be slow
 */

import mitt from '@/utils/mitt';
import type { RouteLocationNormalized } from 'vue-router';
import { getRawRoute } from '@/utils';

const emitter = mitt();

const key = Symbol();

let lastChangeTab: RouteLocationNormalized;

/**
 * @description: 路由变化时触发，在router.beforeEach钩子中调用
 * @param lastChangeRoute 目标路由
 */
export function setRouteChange(lastChangeRoute: RouteLocationNormalized) {
  const r = getRawRoute(lastChangeRoute);
  emitter.emit(key, r);
  lastChangeTab = r; //setRouteChange在listenerRouteChange前面执行，lastChangeTab已经有值了
}

/**
 * @description: 监听传入的回调
 */
export function listenerRouteChange(
  callback: (route: RouteLocationNormalized) => void,
  immediate = true,
) {
  emitter.on(key, callback);
  immediate && lastChangeTab && callback(lastChangeTab);
}

/**
 * @description: 移除回调
 */
export function removeTabChangeListener() {
  emitter.clear();
}
