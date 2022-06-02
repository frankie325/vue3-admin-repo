import { toRaw, ref, nextTick } from 'vue';
import type { RouteLocationNormalized } from 'vue-router';
import { useDesign } from '@/hooks/web/useDesign';
import { useSortable } from '@/hooks/web/useSortable';
import { useMultipleTabStore } from '@/store/modules/multipleTab';
import { isNullOrUnDef } from '@/utils/is';
import projectSetting from '@/settings/projectSetting';
import { useRouter } from 'vue-router';

/**
 * @description: 返回所有固定路由的名称
 */
export function initAffixTabs(): string[] {
  const affixList = ref<RouteLocationNormalized[]>([]);

  const tabStore = useMultipleTabStore();
  const router = useRouter();
  /**
   * @description: 过滤所有固定的路由
   */
  function filterAffixTabs(routes: RouteLocationNormalized[]) {
    const tabs: RouteLocationNormalized[] = [];
    routes &&
      routes.forEach((route) => {
        if (route.meta && route.meta.affix) {
          tabs.push(toRaw(route));
        }
      });
    return tabs;
  }

  /**
   * @description: 添加到tabList中
   */
  function addAffixTabs(): void {
    const affixTabs = filterAffixTabs(router.getRoutes() as unknown as RouteLocationNormalized[]);
    affixList.value = affixTabs;
    for (const tab of affixTabs) {
      tabStore.addTab({
        meta: tab.meta,
        name: tab.name,
        path: tab.path,
      } as unknown as RouteLocationNormalized);
    }
  }

  let isAddAffix = false;

  if (!isAddAffix) {
    addAffixTabs();
    isAddAffix = true;
  }

  return affixList.value.map((item) => item.meta?.title).filter(Boolean) as string[];
}

export function useTabsDrag(affixTextList: string[]) {
  const tabStore = useMultipleTabStore();
  const { multiTabsSetting } = projectSetting;
  const { prefixCls } = useDesign('multiple-tabs');
  nextTick(() => {
    if (!multiTabsSetting.canDrag) return;
    const el = document.querySelectorAll(
      `.${prefixCls} .ant-tabs-nav-wrap > div`,
    )?.[0] as HTMLElement;

    // 使用SortableJS实现tab拖拽
    const { initSortable } = useSortable(el, {
      filter: (e) => {
        const text = (e?.target as HTMLElement)?.innerText;
        if (!text) return false;
        // 固定的标签不可拖拽
        return affixTextList.includes(text);
      },
      onEnd: (evt) => {
        const { oldIndex, newIndex } = evt;

        // if (isNullAndUnDef(oldIndex) || isNullAndUnDef(newIndex) || oldIndex === newIndex) {
        //   return;
        // }
        if (isNullOrUnDef(oldIndex) || isNullOrUnDef(newIndex) || oldIndex === newIndex) {
          return;
        }
        // 重新排序
        tabStore.sortTabs(oldIndex, newIndex);
      },
    });
    initSortable();
  });
}
