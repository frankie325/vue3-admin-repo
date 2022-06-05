<template>
  <a-back-top v-if="getUseOpenBackTop" :target="getTarget" />
  <SettingDrawer v-if="getIsFixedSettingDrawer" :class="prefixCls" />
</template>
<script lang="ts">
  import { defineComponent, computed, unref } from 'vue';

  import { useDesign } from '@/hooks/web/useDesign';
  import { useRootSetting } from '@/hooks/setting/useRootSetting';
  import { useHeaderSetting } from '@/hooks/setting/useHeaderSetting';
  import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';
  import { SettingButtonPositionEnum } from '@/enums/appEnum';

  export default defineComponent({
    name: 'LayoutFeatures',
    components: {
      SettingDrawer: createAsyncComponent(() => import('@/layouts/default/setting/index.vue')),
    },
    setup() {
      const { prefixCls } = useDesign('setting-drawer-feature');
      const { getUseOpenBackTop, getShowSettingButton, getSettingButtonPosition, getFullContent } =
        useRootSetting();
      const { getShowHeader } = useHeaderSetting();

      // 设置按钮是否fixed布局
      const getIsFixedSettingDrawer = computed(() => {
        if (!unref(getShowSettingButton)) {
          return false;
        }
        const settingButtonPosition = unref(getSettingButtonPosition);

        if (settingButtonPosition === SettingButtonPositionEnum.AUTO) {
          return !unref(getShowHeader) || unref(getFullContent);
        }
        return settingButtonPosition === SettingButtonPositionEnum.FIXED;
      });

      return {
        prefixCls,
        getUseOpenBackTop,
        getIsFixedSettingDrawer,
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
