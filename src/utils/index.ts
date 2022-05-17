import type { App, Plugin } from 'vue';

import { isObject } from './is';

/**
 * @description: 实现对象的简单深拷贝
 */
export function deepMerge(src: any = {}, target: any = {}) {
  let key: string;
  for (key in target) {
    src[key] = isObject(src[key]) ? deepMerge(src[key], target[key]) : (src[key] = target[key]);
  }
  return src;
}

/**
 * @description: 为组件安装install方法
 * @param {component} 导出的组件对象
 * @return {alias} 别名，是否注册为全局 property
 */
export const withInstall = <T>(component: T, alias?: string) => {
  const comp = component as any;
  comp.install = (app: App) => {
    app.component(comp.name || comp.displayName, component);
    if (alias) {
      app.config.globalProperties[alias] = component;
    }
  };
  return component as T & Plugin;
};
