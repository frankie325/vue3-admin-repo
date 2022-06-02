<template>
  <div :class="getWrapClass">
    <a-tabs
      type="editable-card"
      size="small"
      :animated="false"
      :hideAdd="true"
      :tabBarGutter="3"
      :activeKey="activeKeyRef"
      @change="handleChange"
      @edit="handleEdit"
    >
      <template v-for="item in getTabsState" :key="item.query ? item.fullPath : item.path">
        <a-tab-pane :closable="!(item && item.meta && item.meta.affix)">
          <template #tab>
            <TabContent :tabItem="item" />
          </template>
        </a-tab-pane>
      </template>

      <template #rightExtra v-if="getShowRedo || getShowQuick">
        <TabRedo v-if="getShowRedo" />
        <TabContent isExtra :tabItem="$route" v-if="getShowQuick" />
        <FoldButton v-if="getShowFold" />
      </template>
    </a-tabs>
  </div>
</template>
<script lang="ts">
  import type { RouteLocationNormalized, RouteMeta } from 'vue-router';
  import { defineComponent, computed, unref, ref } from 'vue';
  import { useRouter } from 'vue-router';

  import TabContent from './components/TabContent.vue';
  import TabRedo from './components/TabRedo.vue';
  import FoldButton from './components/FoldButton.vue';

  import { useMultipleTabStore } from '@/store/modules/multipleTab';
  import { useUserStore } from '@/store/modules/user';
  import { useGo } from '@/hooks/web/usePage';
  import { useDesign } from '@/hooks/web/useDesign';
  import { useMultipleTabSetting } from '@/hooks/setting/useMultipleTabSetting';
  import { listenerRouteChange } from '@/logics/mitt/routeChange';
  import { REDIRECT_NAME } from '@/router/constant';
  import { initAffixTabs, useTabsDrag } from './useMultipleTabs';

  export default defineComponent({
    name: 'MultipleTabs',
    components: {
      TabContent,
      TabRedo,
      FoldButton,
    },
    setup() {
      const affixTextList = initAffixTabs();
      useTabsDrag(affixTextList);

      const { prefixCls } = useDesign('multiple-tabs');
      const go = useGo();
      const tabStore = useMultipleTabStore();
      const userStore = useUserStore();
      const activeKeyRef = ref('');
      const router = useRouter();

      const { getShowQuick, getShowRedo, getShowFold } = useMultipleTabSetting();

      // 获取tabList
      const getTabsState = computed(() => {
        return tabStore.getTabList.filter((item) => !item.meta?.hideTab);
      });

      const unClose = computed(() => unref(getTabsState).length === 1);

      const getWrapClass = computed(() => {
        return [
          prefixCls,
          {
            [`${prefixCls}--hide-close`]: unref(unClose),
          },
        ];
      });

      listenerRouteChange((route) => {
        const { name } = route;
        if (name === REDIRECT_NAME || !route || !userStore.getToken) {
          return;
        }

        const { path, fullPath, meta = {} } = route;
        const { currentActiveMenu, hideTab } = meta as RouteMeta;

        const isHide = !hideTab ? null : currentActiveMenu;

        const p = isHide || fullPath || path;
        // 设置激活的标签页
        if (activeKeyRef.value !== p) {
          activeKeyRef.value = p as string;
        }

        // 存储到tabStore
        if (isHide) {
          const findParentRoute = router
            .getRoutes()
            .find((item) => item.path === currentActiveMenu);
          findParentRoute && tabStore.addTab(findParentRoute as unknown as RouteLocationNormalized);
        } else {
          tabStore.addTab(unref(route));
        }
      });

      // 切换面板时触发
      function handleChange(activeKey: any) {
        activeKeyRef.value = activeKey;
        go(activeKey, false);
      }

      // 关闭标签页触发
      function handleEdit(targetKey: string) {
        // 只有一个时，不关闭
        if (unref(unClose)) {
          return;
        }
        tabStore.closeTabByKey(targetKey, router);
      }

      return {
        getWrapClass,
        getTabsState,
        activeKeyRef,
        getShowRedo,
        getShowQuick,
        getShowFold,
        handleChange,
        handleEdit,
      };
    },
  });
</script>
<style lang="less">
  @import './index.less';
</style>
