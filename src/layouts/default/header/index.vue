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
      <LayoutBreadcrumb v-if="getShowContent && getShowBread" :theme="getHeaderTheme" />
    </div>
    <div :class="`${prefixCls}-menu`" v-if="getShowTopMenu && !getIsMobile">
      <LayoutMenu
        :isHorizontal="true"
        :theme="getHeaderTheme"
        :splitType="getSplitType"
        :menuMode="getMenuMode"
      />
    </div>
    <div :class="`${prefixCls}-action`">
      <SettingDrawer v-if="getShowSetting" :class="`${prefixCls}-action__item`" />
    </div> </a-layout-header
></template>

<script lang="ts">
  import { defineComponent, unref, computed } from 'vue';
  import { propTypes } from '@/utils/propTypes';

  import { AppLogo } from '@/components/Application';
  import LayoutTrigger from '../trigger/index.vue';
  import LayoutMenu from '../menu/index.vue';
  import { LayoutBreadcrumb } from './components';

  import { useDesign } from '@/hooks/web/useDesign';
  import { useAppInject } from '@/hooks/web/useAppInject';
  import { useRootSetting } from '@/hooks/setting/useRootSetting';
  import { useMenuSetting } from '@/hooks/setting/useMenuSetting';
  import { MenuModeEnum, MenuSplitTyeEnum } from '@/enums/menuEnum';
  import { useHeaderSetting } from '@/hooks/setting/useHeaderSetting';
  import { SettingButtonPositionEnum } from '@/enums/appEnum';
  import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';

  export default defineComponent({
    name: 'LayoutHeader',
    components: {
      AppLogo,
      LayoutTrigger,
      LayoutMenu,
      LayoutBreadcrumb,
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

      const { getHeaderTheme, getShowHeader, getShowHeaderLogo, getShowContent, getShowBread } =
        useHeaderSetting();
      const {
        getIsMixMode,
        getMenuWidth,
        getShowHeaderTrigger,
        getSplit,
        getIsMixSidebar,
        getShowTopMenu,
      } = useMenuSetting();
      const { getUseErrorHandle, getShowSettingButton, getSettingButtonPosition } =
        useRootSetting();

      // 设置头部类名
      const getHeaderClass = computed(() => {
        const theme = unref(getHeaderTheme);
        return [
          prefixCls,
          {
            [`${prefixCls}--fixed`]: props.fixed,
            [`${prefixCls}--mobile`]: unref(getIsMobile), // 屏幕断点小于lg应用
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

      const getSplitType = computed(() => {
        return unref(getSplit) ? MenuSplitTyeEnum.TOP : MenuSplitTyeEnum.NONE;
      });

      const getMenuMode = computed(() => {
        return unref(getSplit) ? MenuModeEnum.HORIZONTAL : null;
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
        getSplitType,
        getMenuMode,
        getShowTopMenu,
        getShowBread,
      };
    },
  });
</script>

<style lang="less">
  @import './index.less';
</style>
