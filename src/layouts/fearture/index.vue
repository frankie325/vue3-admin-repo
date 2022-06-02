<template>
  <a-back-top v-if="getUseOpenBackTop" :target="getTarget" />
</template>
<script lang="ts">
  import { defineComponent, computed, unref } from 'vue';

  import { useDesign } from '@/hooks/web/useDesign';
  import { useRootSetting } from '@/hooks/setting/useRootSetting';
  import { useHeaderSetting } from '@/hooks/setting/useHeaderSetting';

  export default defineComponent({
    name: 'LayoutFeatures',
    components: {},
    setup() {
      const { prefixCls } = useDesign('setting-drawer-feature');
      const { getUseOpenBackTop, getShowSettingButton, getSettingButtonPosition, getFullContent } =
        useRootSetting();
      return {
        prefixCls,
        getUseOpenBackTop,
        getTarget: () => document.body,
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-setting-drawer-feature';

  .@{prefix-cls} {
    position: absolute;
    top: 45%;
    right: 0;
    z-index: 10;
    display: flex;
    padding: 10px;
    color: @white;
    cursor: pointer;
    background-color: @primary-color;
    border-radius: 6px 0 0 6px;
    justify-content: center;
    align-items: center;

    svg {
      width: 1em;
      height: 1em;
    }
  }
</style>
