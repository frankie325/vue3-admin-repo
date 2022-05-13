import type { App, Plugin } from 'vue';

/**
 * @description: 为组件安装install方法
 */

/**
 * @description:
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
