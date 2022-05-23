<template>
  <a-layout :class="prefixCls">
    <LayoutHeader fixed />
    <a-layout :class="[layoutClass]">
      <LayoutSideBar v-if="getShowSidebar || getIsMobile" />
      <a-layout :class="`${prefixCls}-main`"> </a-layout>
      <router-view></router-view>
    </a-layout>
  </a-layout>
</template>

<script lang="ts">
  import { computed, defineComponent, unref } from 'vue';

  import LayoutHeader from './header/index.vue';
  import LayoutSideBar from './sider/index.vue';

  import { useDesign } from '@/hooks/web/useDesign';
  import { useAppInject } from '@/hooks/web/useAppInject';
  import { useMenuSetting } from '@/hooks/setting/useMenuSetting';

  export default defineComponent({
    name: 'LayoutContent',
    components: {
      LayoutHeader,
      LayoutSideBar,
    },
    setup() {
      const { prefixCls } = useDesign('default-layout');
      const { getIsMobile } = useAppInject();

      const { getShowSidebar, getIsMixSidebar, getShowMenu } = useMenuSetting();

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
