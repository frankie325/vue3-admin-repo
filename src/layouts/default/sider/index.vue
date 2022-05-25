<template>
  <a-drawer v-if="getIsMobile" placement="left"> </a-drawer>
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
