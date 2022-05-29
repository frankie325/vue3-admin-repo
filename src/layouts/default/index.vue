<template>
  <a-layout :class="prefixCls">
    <!-- <LayoutFeatures /> -->
    <!-- 顶部混合模式 展示外层的header -->
    <LayoutHeader fixed v-if="getShowFullHeaderRef" />
    <a-layout :class="[layoutClass]">
      <LayoutSideBar v-if="getShowSidebar || getIsMobile" />
      <a-layout :class="`${prefixCls}-main`">
        <LayoutMultipleHeader />
        <router-view></router-view>
      </a-layout>
    </a-layout>
    <!-- <LayoutContent /> -->
  </a-layout>
</template>

<script lang="ts">
  import { computed, defineComponent, unref } from 'vue';

  import LayoutHeader from './header/index.vue';
  import LayoutSideBar from './sider/index.vue';
  import LayoutMultipleHeader from './header/MultipleHeader.vue';
  import LayoutContent from './content/index.vue';

  import { useDesign } from '@/hooks/web/useDesign';
  import { useAppInject } from '@/hooks/web/useAppInject';
  import { useHeaderSetting } from '@/hooks/setting/useHeaderSetting';
  import { useMenuSetting } from '@/hooks/setting/useMenuSetting';
  import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';

  export default defineComponent({
    name: 'LayoutContent',
    components: {
      // LayoutFeatures: createAsyncComponent(() => import('@/layouts/default/feature/index.vue')),
      LayoutHeader,
      LayoutSideBar,
      LayoutMultipleHeader,
      // LayoutContent,
    },
    setup() {
      const { prefixCls } = useDesign('default-layout');
      const { getIsMobile } = useAppInject();
      const { getShowFullHeaderRef } = useHeaderSetting();
      const { getShowSidebar, getIsMixSidebar, getShowMenu } = useMenuSetting();

      // 显示菜单则添加ant-layout-has-sider类名，变成水平flex布局
      const layoutClass = computed(() => {
        let cls: string[] = ['ant-layout'];
        if (unref(getIsMixSidebar) || unref(getShowMenu)) {
          cls.push('ant-layout-has-sider');
        }
        return cls;
      });

      return {
        prefixCls,
        getIsMobile,
        layoutClass,
        getShowSidebar,
        getShowFullHeaderRef,
      };
    },
  });
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-default-layout';

  .@{prefix-cls} {
    display: flex;
    width: 100%;
    min-height: 100%;
    background-color: @content-bg;
    // flex-direction: column;

    > .ant-layout {
      min-height: 100%;
    }

    &-main {
      width: 100%;
      margin-left: 1px;
    }
  }
</style>
