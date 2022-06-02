import type { RouteLocationNormalized, RouteLocationRaw, Router } from 'vue-router';

import { toRaw, unref } from 'vue';
import { defineStore } from 'pinia';
import { store } from '@/store';
import { MULTIPLE_TABS_KEY } from '@/enums/cacheEnum';
import { Persistent } from '@/utils/cache/persistent';
import projectSetting from '@/settings/projectSetting';
import { getRawRoute } from '@/utils';
import { PageEnum } from '@/enums/pageEnum';
import { PAGE_NOT_FOUND_ROUTE, REDIRECT_ROUTE } from '@/router/routes/basic';
import { useGo, useRedo } from '@/hooks/web/usePage';
import { useUserStore } from '@/store/modules/user';

function handleGotoPage(router: Router) {
  const go = useGo(router);
  go(unref(router.currentRoute).path, true);
}

const getToTarget = (tabItem: RouteLocationNormalized) => {
  const { params, path, query } = tabItem;
  return {
    params: params || {},
    path,
    query: query || {},
  };
};

export interface MultipleTabState {
  cacheTabList: Set<string>;
  tabList: RouteLocationNormalized[];
  lastDragEndIndex: number;
}

const cacheTab = projectSetting.multiTabsSetting.cache;

export const useMultipleTabStore = defineStore({
  id: 'app-multiple-tab',
  state: (): MultipleTabState => ({
    cacheTabList: new Set(),
    tabList: cacheTab ? Persistent.getLocal(MULTIPLE_TABS_KEY) || [] : [],
    // 拖拽tab次数
    lastDragEndIndex: 0,
  }),
  getters: {
    getTabList(): RouteLocationNormalized[] {
      return this.tabList;
    },
    getCachedTabList(): string[] {
      return Array.from(this.cacheTabList);
    },
    getLastDragEndIndex(): number {
      return this.lastDragEndIndex;
    },
  },
  actions: {
    /**
     * @description: 清空缓存的tabs
     */
    clearCacheTabs(): void {
      this.cacheTabList = new Set();
    },
    /**
     * @description: 更新缓存的tabs
     */
    async updateCacheTab() {
      const cacheMap: Set<string> = new Set();

      for (const tab of this.tabList) {
        const item = getRawRoute(tab);
        // 忽略缓存
        const needCache = !item.meta?.ignoreKeepAlive;
        if (!needCache) {
          continue;
        }
        const name = item.name as string;
        cacheMap.add(name);
      }
      this.cacheTabList = cacheMap;
    },
    /**
     * @description: 刷新标签页页面
     */
    async refreshPage(router: Router) {
      const { currentRoute } = router;
      const route = unref(currentRoute);
      const name = route.name;

      const findTab = this.getCachedTabList.find((item) => item === name);
      if (findTab) {
        // 从缓存中移除
        this.cacheTabList.delete(findTab);
      }
      const redo = useRedo(router);
      await redo();
    },
    /**
     * @description: 新增路由到tabList
     */
    async addTab(route: RouteLocationNormalized) {
      const { path, name, fullPath, params, query, meta } = getRawRoute(route);

      // 404页面等不需要添加到标签页
      if (
        path === PageEnum.ERROR_PAGE ||
        path === PageEnum.BASE_LOGIN ||
        !name ||
        [REDIRECT_ROUTE.name, PAGE_NOT_FOUND_ROUTE.name].includes(name as string)
      ) {
        return;
      }

      let updateIndex = -1;
      // 该路由已经存在了，则不用重复添加
      const tabHasExits = this.tabList.some((tab, index) => {
        updateIndex = index;
        return (tab.fullPath || tab.path) === (fullPath || path);
      });
      if (tabHasExits) {
        // 更新参数
        const curTab = toRaw(this.tabList)[updateIndex];
        if (!curTab) {
          return;
        }
        curTab.params = params || curTab.params;
        curTab.query = query || curTab.query;
        curTab.fullPath = fullPath || curTab.fullPath;
        this.tabList.splice(updateIndex, 1, curTab);
      } else {
        // Add tab
        // 动态路由可打开Tab页数，超过 0 即代表需要控制打开数
        const dynamicLevel = meta?.dynamicLevel ?? -1;
        if (dynamicLevel > 0) {
          // 如果大于 0 了，就要限制该路由的打开数限制了
          // 首先获取到用户设置的真实的路由
          const realPath = meta?.realPath ?? '';
          // 获取到已经打开的动态路由数, 判断是否大于dynamicLevel
          if (
            this.tabList.filter((e) => e.meta?.realPath ?? '' === realPath).length >= dynamicLevel
          ) {
            // 关闭第一个
            const index = this.tabList.findIndex((item) => item.meta.realPath === realPath);
            index !== -1 && this.tabList.splice(index, 1);
          }
        }
        this.tabList.push(route);
      }
      this.updateCacheTab();
      cacheTab && Persistent.setLocal(MULTIPLE_TABS_KEY, this.tabList);
    },
    /**
     * @description: 将tab从tabList中删除
     */
    async closeTab(tab: RouteLocationNormalized, router: Router) {
      // 从tabList删除
      const close = (route: RouteLocationNormalized) => {
        const { fullPath, meta: { affix } = {} } = route;
        if (affix) {
          return;
        }
        const index = this.tabList.findIndex((item) => item.fullPath === fullPath);
        index !== -1 && this.tabList.splice(index, 1);
      };

      const { currentRoute, replace } = router;

      const { path } = unref(currentRoute);
      if (path !== tab.path) {
        // 关闭的标签不是当前激活的路由，从tabList删除即可
        close(tab);
        return;
      }

      // 关闭的标签如果是当前激活的路由
      let toTarget: RouteLocationRaw = {};

      const index = this.tabList.findIndex((item) => item.path === path);

      // 如果关闭的是第一个tab
      if (index === 0) {
        // 只有一个tab，则跳到BASE_HOME
        if (this.tabList.length === 1) {
          const userStore = useUserStore();
          toTarget = userStore.getUserInfo.homePath || PageEnum.BASE_HOME;
        } else {
          // 否则跳到右边tab对应的路由
          const page = this.tabList[index + 1];
          toTarget = getToTarget(page);
        }
      } else {
        // 关闭的tab不是第一个，则跳到左边tab对应的路由
        const page = this.tabList[index - 1];
        toTarget = getToTarget(page);
      }
      // 将当前tab从tabList删除
      close(currentRoute.value);
      await replace(toTarget);
    },
    /**
     * @description: 根据key将tab从tabList中删除
     * @param {string} key 路由path
     */
    async closeTabByKey(key: string, router: Router) {
      const index = this.tabList.findIndex((item) => (item.fullPath || item.path) === key);
      if (index !== -1) {
        await this.closeTab(this.tabList[index], router);
        const { currentRoute, replace } = router;
        // 检查当前路由是否存在于tabList中
        const isActivated = this.tabList.findIndex((item) => {
          return item.fullPath === currentRoute.value.fullPath;
        });
        // 如果当前路由不存在于TabList中，尝试切换到其它路由
        if (isActivated === -1) {
          let pageIndex;
          if (index > 0) {
            pageIndex = index - 1;
          } else if (index < this.tabList.length - 1) {
            pageIndex = index + 1;
          } else {
            pageIndex = -1;
          }
          if (pageIndex >= 0) {
            const page = this.tabList[index - 1];
            const toTarget = getToTarget(page);
            await replace(toTarget);
          }
        }
      }
    },
    /**
     * @description: 从tabList删除部分tabs
     */
    async bulkCloseTabs(pathList: string[]) {
      this.tabList = this.tabList.filter((item) => !pathList.includes(item.fullPath));
    },
    /**
     * @description: 关闭左侧tab
     */
    async closeLeftTabs(route: RouteLocationNormalized, router: Router) {
      const index = this.tabList.findIndex((item) => item.path === route.path);

      if (index > 0) {
        const leftTabs = this.tabList.slice(0, index); //左侧tabs
        const pathList: string[] = [];
        for (const item of leftTabs) {
          const affix = item?.meta?.affix ?? false; // 标签页非固定才需要删除
          if (!affix) {
            pathList.push(item.fullPath);
          }
        }
        this.bulkCloseTabs(pathList);
      }
      this.updateCacheTab();
      handleGotoPage(router);
    },
    /**
     * @description: 关闭右侧tab
     */
    async closeRightTabs(route: RouteLocationNormalized, router: Router) {
      const index = this.tabList.findIndex((item) => item.fullPath === route.fullPath);

      if (index >= 0 && index < this.tabList.length - 1) {
        const rightTabs = this.tabList.slice(index + 1, this.tabList.length);

        const pathList: string[] = [];
        for (const item of rightTabs) {
          const affix = item?.meta?.affix ?? false;
          if (!affix) {
            pathList.push(item.fullPath);
          }
        }
        this.bulkCloseTabs(pathList);
      }
      this.updateCacheTab();
      handleGotoPage(router);
    },
    /**
     * @description: 关闭其他tab
     */
    async closeOtherTabs(route: RouteLocationNormalized, router: Router) {
      const closePathList = this.tabList.map((item) => item.fullPath);

      const pathList: string[] = [];

      for (const path of closePathList) {
        // 将其他tab选出
        if (path !== route.fullPath) {
          const closeItem = this.tabList.find((item) => item.path === path);
          if (!closeItem) {
            continue;
          }
          const affix = closeItem?.meta?.affix ?? false;
          if (!affix) {
            pathList.push(closeItem.fullPath);
          }
        }
      }
      this.bulkCloseTabs(pathList);
      this.updateCacheTab();
      handleGotoPage(router);
    },
    /**
     * @description: 关闭所有tab
     */
    async closeAllTab(router: Router) {
      this.tabList = this.tabList.filter((item) => item?.meta?.affix ?? false);
      this.clearCacheTabs();
      this.goToPage(router);
    },
    /**
     * @description: 关闭所有tab后跳转页面
     */
    goToPage(router: Router) {
      const go = useGo(router);
      const len = this.tabList.length;
      const { path } = unref(router.currentRoute);

      let toPath: PageEnum | string = PageEnum.BASE_HOME;

      // 如果tabList还存在值，则跳转到最后一个tab对应的页面，否则跳转到BASE_HOME
      if (len > 0) {
        const page = this.tabList[len - 1];
        const p = page.fullPath || page.path;
        if (p) {
          toPath = p;
        }
      }
      path !== toPath && go(toPath as PageEnum, true);
    },
    /**
     * @description: 拖拽节点后更新位置
     */
    async sortTabs(oldIndex: number, newIndex: number) {
      const currentTab = this.tabList[oldIndex];
      this.tabList.splice(oldIndex, 1);
      this.tabList.splice(newIndex, 0, currentTab);
      this.lastDragEndIndex = this.lastDragEndIndex + 1;
    },
    /**
     * @description: 更新标签页标题
     */
    async setTabTitle(title: string, route: RouteLocationNormalized) {
      const findTab = this.getTabList.find((item) => item === route);
      if (findTab) {
        findTab.meta.title = title;
        await this.updateCacheTab();
      }
    },
    /**
     * @description: 更新标签页path
     */
    // async updateTabPath(fullPath: string, route: RouteLocationNormalized) {
    //   const findTab = this.getTabList.find((item) => item === route);
    //   if (findTab) {
    //     findTab.fullPath = fullPath;
    //     findTab.path = fullPath;
    //     await this.updateCacheTab();
    //   }
    // },
  },
});
