<template>
  <!-- 当屏幕断点小于lg时，显示抽屉中的菜单 -->
  <a-drawer
    v-if="getIsMobile"
    placement="left"
    :class="prefixCls"
    :width="getMenuWidth"
    :getContainer="null"
    :visible="!getCollapsed"
    @close="handleClose"
  >
    <LayoutSider />
  </a-drawer>
  <MixSider v-else-if="getIsMixSidebar" />
  <LayoutSider v-else />
</template>
<script lang="ts">
  import { defineComponent } from 'vue';

  import LayoutSider from './LayoutSider.vue';
  import MixSider from './MixSider.vue';

  import { useDesign } from '@/hooks/web/useDesign';
  import { useAppInject } from '@/hooks/web/useAppInject';
  import { useMenuSetting } from '@/hooks/setting/useMenuSetting';

  export default defineComponent({
    name: 'SiderWrapper',
    components: {
      LayoutSider,
      MixSider,
    },
    setup() {
      const { prefixCls } = useDesign('layout-sider-wrapper');
      const { getIsMobile } = useAppInject();
      const { setMenuSetting, getCollapsed, getMenuWidth, getIsMixSidebar } = useMenuSetting();

      // 关闭抽屉
      function handleClose() {
        setMenuSetting({
          collapsed: true,
        });
      }

      return {
        prefixCls,
        getIsMobile,
        getCollapsed,
        handleClose,
        getMenuWidth,
        getIsMixSidebar,
      };
    },
  });
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-layout-sider-wrapper';

  .@{prefix-cls} {
    .ant-drawer-body {
      height: 100vh;
      padding: 0;
    }

    .ant-drawer-header-no-title {
      display: none;
    }
  }
</style>
