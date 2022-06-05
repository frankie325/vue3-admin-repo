import type { FunctionalComponent } from 'vue';
import type { RouteLocation } from 'vue-router';

export interface DefaultContext {
  Component: FunctionalComponent & { type: Recordable };
  route: RouteLocation;
}

export function getTransitionName({
  route, // 当前路由
  openCache, // 是否开启KeepAlive缓存
  cacheTabs, // 缓存的tabList
  enableTransition, //是否使用动画效果
  def, // 框架内页面切换时动画效果
}: Pick<DefaultContext, 'route'> & {
  enableTransition: boolean;
  openCache: boolean;
  def: string;
  cacheTabs: string[];
}): string | undefined {
  if (!enableTransition) {
    return undefined;
  }
  const isInCache = cacheTabs.includes(route.name as string); //当前路由是否在缓存里
  const transitionName = 'fade-slide';
  let name: string | undefined = transitionName;

  if (openCache) {
    name = isInCache && route.meta.loaded ? transitionName : undefined;
  }
  return name || (route.meta.transitionName as string) || def;
}
