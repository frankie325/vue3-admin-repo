<template>
  <a-layout-header :class="getHeaderClass">
    <div :class="`${prefixCls}-left`">
      <AppLogo
        v-if="getShowHeaderLogo || getIsMobile"
        :class="`${prefixCls}-logo`"
        :theme="getHeaderTheme"
        :style="getLogoWidth"
      />
      <LayoutTrigger
        v-if="
          (getShowContent && getShowHeaderTrigger && !getSplit && !getIsMixSidebar) || getIsMobile
        "
        :theme="getHeaderTheme"
        :sider="false"
      />
    </div>
    <div :class="`${prefixCls}-menu`">menu</div>
    <div :class="`${prefixCls}-action`">
      <SettingDrawer v-if="getShowSetting" :class="`${prefixCls}-action__item`" />
    </div> </a-layout-header
></template>

<script lang="ts">
  import { defineComponent, unref, computed } from 'vue';
  import { propTypes } from '@/utils/propTypes';

  import { AppLogo } from '@/components/Application';
  import LayoutTrigger from '../trigger/index.vue';

  import { useDesign } from '@/hooks/web/useDesign';
  import { useAppInject } from '@/hooks/web/useAppInject';
  import { useRootSetting } from '@/hooks/setting/useRootSetting';
  import { useMenuSetting } from '@/hooks/setting/useMenuSetting';

  import { useHeaderSetting } from '@/hooks/setting/useHeaderSetting';
  import { SettingButtonPositionEnum } from '@/enums/appEnum';
  import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';

  export default defineComponent({
    name: 'LayoutHeader',
    components: {
      AppLogo,
      LayoutTrigger,
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

      const { getHeaderTheme, getShowHeader, getShowHeaderLogo, getShowContent } =
        useHeaderSetting();
      const { getIsMixMode, getMenuWidth, getShowHeaderTrigger, getSplit, getIsMixSidebar } =
        useMenuSetting();
      const { getUseErrorHandle, getShowSettingButton, getSettingButtonPosition } =
        useRootSetting();

      // 设置头部类名
      const getHeaderClass = computed(() => {
        const theme = unref(getHeaderTheme);
        return [
          prefixCls,
          {
            [`${prefixCls}--fixed`]: props.fixed,
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

      const getLogoWidth = computed(() => {
        if (!unref(getIsMixMode) || unref(getIsMobile)) {
          return {};
        }
        const width = unref(getMenuWidth) < 180 ? 180 : unref(getMenuWidth);
        return { width: `${width}px` };
      });

      return {
        prefixCls,
        getIsMobile,
        getHeaderClass,
        getHeaderTheme,
        getShowSetting,
        getShowHeaderLogo,
        getLogoWidth,
        getShowContent,
        getShowHeaderTrigger,
        getSplit,
        getIsMixSidebar,
      };
    },
  });
</script>

<style lang="less">
  @import './index.less';
</style>
