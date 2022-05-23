<template>
  <a-drawer v-if="getIsMobile" placement="left"> </a-drawer>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';

  import { useDesign } from '@/hooks/web/useDesign';
  import { useAppInject } from '@/hooks/web/useAppInject';
  import { useMenuSetting } from '@/hooks/setting/useMenuSetting';

  export default defineComponent({
    name: 'SiderWrapper',
    setup() {
      const { prefixCls } = useDesign('layout-sider-wrapper');
      const { getIsMobile } = useAppInject();
      const { setMenuSetting, getCollapsed, getMenuWidth, getIsMixSidebar } = useMenuSetting();

      //
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
