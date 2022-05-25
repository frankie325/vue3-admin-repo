<template>
  <a-layout-header :class="getHeaderClass">
    <div :class="`${prefixCls}-left`">left</div>
    <div :class="`${prefixCls}-menu`">menu</div>
    <div :class="`${prefixCls}-action`">
      <SettingDrawer v-if="getShowSetting" :class="`${prefixCls}-action__item`" />
    </div> </a-layout-header
></template>

<script lang="ts">
  import { defineComponent, unref, computed } from 'vue';
  import { propTypes } from '@/utils/propTypes';

  import { useDesign } from '@/hooks/web/useDesign';
  import { useAppInject } from '@/hooks/web/useAppInject';

  import { useRootSetting } from '@/hooks/setting/useRootSetting';
  import { useHeaderSetting } from '@/hooks/setting/useHeaderSetting';
  import { SettingButtonPositionEnum } from '@/enums/appEnum';
  import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';

  export default defineComponent({
    name: 'LayoutHeader',
    components: {
      SettingDrawer: createAsyncComponent(() => import('@/layouts/default/setting/index.vue'), {
        loading: true,
      }),
    },
    props: {
      fixed: propTypes.bool,
    },
    setup(props) {
      const { prefixCls } = useDesign('layout-header');
      const { getIsMobile } = useAppInject();

      const { getHeaderTheme, getShowHeader } = useHeaderSetting();
      const { getUseErrorHandle, getShowSettingButton, getSettingButtonPosition } =
        useRootSetting();

      // 设置头部类名
      const getHeaderClass = computed(() => {
        const theme = unref(getHeaderTheme);
        return [
          prefixCls,
          {
            [`${prefixCls}--fix`]: props.fixed,
            [`${prefixCls}--mobile`]: unref(getIsMobile),
            [`${prefixCls}--${theme}`]: theme, //根据头部主题切换头部背景色
          },
        ];
      });

      // 是否显示项目设置按钮
      const getShowSetting = computed(() => {
        if (!unref(getShowSettingButton)) {
          return false;
        }
        const settingButtonPosition = unref(getSettingButtonPosition);

        if (settingButtonPosition === SettingButtonPositionEnum.AUTO) {
          return unref(getShowHeader);
        }
        return settingButtonPosition === SettingButtonPositionEnum.HEADER;
      });

      return {
        prefixCls,
        getHeaderClass,
        getShowSetting,
      };
    },
  });
</script>

<style lang="less">
  @import './index.less';
</style>
