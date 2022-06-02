import type { TabContentProps } from './types';
import type { ComputedRef } from 'vue';

import { computed, unref, reactive } from 'vue';
import { MenuEventEnum } from './types';
import { useMultipleTabStore } from '@/store/modules/multipleTab';
import { RouteLocationNormalized, useRouter } from 'vue-router';
import { useTabs } from '@/hooks/web/useTabs';
import { useI18n } from '@/hooks/web/useI18n';

interface TabDropMenu {
  onClick?: Fn;
  to?: string;
  icon?: string;
  event: string | number;
  text: string;
  disabled?: boolean;
  divider?: boolean;
}

export function useTabDropdown(tabContentProps: TabContentProps, getIsTabs: ComputedRef<boolean>) {
  const state = reactive({
    current: null as Nullable<RouteLocationNormalized>,
    currentIndex: 0,
  });

  const { t } = useI18n();
  const tabStore = useMultipleTabStore();
  const { currentRoute } = useRouter();
  const { refreshPage, closeAll, close, closeLeft, closeOther, closeRight } = useTabs();

  // 标签对应的路由
  const getTargetTab = computed((): RouteLocationNormalized => {
    return unref(getIsTabs) ? tabContentProps.tabItem : unref(currentRoute);
  });

  /**
   * @description: tab内容右键弹出列表
   */
  const getDropMenuList = computed(() => {
    if (!unref(getTargetTab)) {
      return;
    }

    const { meta } = unref(getTargetTab);
    const { path } = unref(currentRoute);

    const curItem = state.current;

    // 右键选中的tab和当前激活的标签为同一个时，则启用刷新功能
    const isCurItem = curItem ? curItem.path === path : false;

    const index = state.currentIndex;
    const refreshDisabled = !isCurItem;
    //
    // 为第一个tab或者右键选中的不是激活tab，则不会启用关闭左侧标签页功能
    const closeLeftDisabled = index === 0 || !isCurItem;

    const disabled = tabStore.getTabList.length === 1;

    // 右键选中的不是当前激活tab或者为最后一个标签则不会启用关闭右侧标签页功能
    const closeRightDisabled =
      !isCurItem || (index === tabStore.getTabList.length - 1 && tabStore.getLastDragEndIndex >= 0);

    const dropMenuList: TabDropMenu[] = [
      {
        icon: 'ion:reload-sharp',
        event: MenuEventEnum.REFRESH_PAGE,
        text: t('layout.multipleTab.reload'),
        disabled: refreshDisabled,
      },
      {
        icon: 'clarity:close-line',
        event: MenuEventEnum.CLOSE_CURRENT,
        text: t('layout.multipleTab.close'),
        disabled: !!meta?.affix || disabled,
        divider: true,
      },
      {
        icon: 'line-md:arrow-close-left',
        event: MenuEventEnum.CLOSE_LEFT,
        text: t('layout.multipleTab.closeLeft'),
        disabled: closeLeftDisabled,
        divider: false,
      },
      {
        icon: 'line-md:arrow-close-right',
        event: MenuEventEnum.CLOSE_RIGHT,
        text: t('layout.multipleTab.closeRight'),
        disabled: closeRightDisabled,
        divider: true,
      },
      {
        icon: 'dashicons:align-center',
        event: MenuEventEnum.CLOSE_OTHER,
        text: t('layout.multipleTab.closeOther'),
        disabled: disabled || !isCurItem,
      },
      {
        icon: 'clarity:minus-line',
        event: MenuEventEnum.CLOSE_ALL,
        text: t('layout.multipleTab.closeAll'),
        disabled: disabled,
      },
    ];

    return dropMenuList;
  });

  /**
   * @description: 设置当前右键选中的标签页
   */
  function handleContextMenu(tabItem: RouteLocationNormalized) {
    return (e: Event) => {
      if (!tabItem) {
        return;
      }
      e?.preventDefault();
      const index = tabStore.getTabList.findIndex((tab) => tab.path === tabItem.path);
      state.current = tabItem;
      state.currentIndex = index;
    };
  }

  /**
   * @description: 处理弹出菜单上的功能
   */
  function handleMenuEvent(menu: TabDropMenu): void {
    const { event } = menu;
    switch (event) {
      // 刷新当前路由
      case MenuEventEnum.REFRESH_PAGE:
        refreshPage();
        break;
      // 关闭标签
      case MenuEventEnum.CLOSE_CURRENT:
        close(tabContentProps.tabItem);
        break;
      // 关闭左侧标签
      case MenuEventEnum.CLOSE_LEFT:
        closeLeft();
        break;
      // 关闭右侧标签
      case MenuEventEnum.CLOSE_RIGHT:
        closeRight();
        break;
      // 关闭其他标签
      case MenuEventEnum.CLOSE_OTHER:
        closeOther();
        break;
      // 关闭所有标签
      case MenuEventEnum.CLOSE_ALL:
        closeAll();
        break;
    }
  }
  return { getDropMenuList, handleMenuEvent, handleContextMenu };
}
