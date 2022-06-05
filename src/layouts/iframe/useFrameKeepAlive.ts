import type { AppRouteRecordRaw } from '@/router/types';
import { computed, toRaw, unref } from 'vue';
import { useRouter } from 'vue-router';

import { useMultipleTabStore } from '@/store/modules/multipleTab';
import { useMultipleTabSetting } from '@/hooks/setting/useMultipleTabSetting';
import { uniqBy } from 'lodash-es';

export function useFrameKeepAlive() {
  const router = useRouter();
  const { currentRoute } = router;
  const { getShowMultipleTab } = useMultipleTabSetting();
  const tabStore = useMultipleTabStore();

  // 所有iframe页面的路由
  const getFramePages = computed(() => {
    const ret = getAllFramePages(toRaw(router.getRoutes()) as unknown as AppRouteRecordRaw[]) || [];
    return ret;
  });

  // tabList中所有iframe页面的路由
  const getOpenTabList = computed((): string[] => {
    return tabStore.getTabList.reduce((prev: string[], next) => {
      if (next.meta && Reflect.has(next.meta, 'frameSrc')) {
        prev.push(next.name as string);
      }
      return prev;
    }, []);
  });

  /**
   * @description: 获取所有iframe页面的路由，存在meta.frameSrc，则是内嵌页面路由
   */
  function getAllFramePages(routes: AppRouteRecordRaw[]): AppRouteRecordRaw[] {
    let res: AppRouteRecordRaw[] = [];
    for (const route of routes) {
      const { meta: { frameSrc } = {}, children } = route;
      if (frameSrc) {
        res.push(route);
      }
      if (children && children.length) {
        res.push(...getAllFramePages(children));
      }
    }
    res = uniqBy(res, 'name'); //name相同的去重
    return res;
  }

  /**
   * @description: 是否显示FramePage组件
   */
  function showIframe(item: AppRouteRecordRaw) {
    return item.name === unref(currentRoute).name;
  }

  /**
   * @description: 是否渲染FramePage组件，iframe页面路由先添加到tabList中，再进行渲染
   */
  function hasRenderFrame(name: string) {
    if (!unref(getShowMultipleTab)) {
      // 不显示标签页时，只要判断当前路由是否和iframe路由名称相等
      return router.currentRoute.value.name === name;
    }

    return unref(getOpenTabList).includes(name);
  }

  return { hasRenderFrame, getFramePages, showIframe, getAllFramePages };
}
