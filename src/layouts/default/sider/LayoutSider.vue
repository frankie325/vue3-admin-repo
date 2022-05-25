<template>
  <div v-if="getMenuFixed && !getIsMobile" :style="getHiddenDomStyle"> </div>
  <a-layout-sider>sider</a-layout-sider>
</template>
<script lang="ts">
  import { computed, defineComponent, ref, unref, CSSProperties, h } from 'vue';

  import { useDesign } from '@/hooks/web/useDesign';
  import { useAppInject } from '@/hooks/web/useAppInject';

  import { useMenuSetting } from '@/hooks/setting/useMenuSetting';

  export default defineComponent({
    name: 'LayoutSideBar',
    setup() {
      const { getIsMobile } = useAppInject();

      const { getRealWidth, getMenuFixed } = useMenuSetting();

      const getHiddenDomStyle = computed((): CSSProperties => {
        const width = `${unref(getRealWidth)}px`;

        return {
          width: width,
          overflow: 'hidden',
          flex: `0 0 ${width}`,
          maxWidth: width,
          minWidth: width,
          transition: 'all 0.2s',
        };
      });

      return {
        getIsMobile,
        getMenuFixed,
        getHiddenDomStyle,
      };
    },
  });
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-layout-sideBar';
</style>
