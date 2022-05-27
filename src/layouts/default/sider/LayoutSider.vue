<template>
  <div v-if="getMenuFixed && !getIsMobile" :style="getHiddenDomStyle" v-show="showClassSideBarRef">
  </div>
  <a-layout-sider
    v-show="showClassSideBarRef"
    breakpoint="lg"
    :class="getSiderClass"
    :width="getMenuWidth"
    :collapsed="getCollapsed"
    :collapsedWidth="getCollapsedWidth"
    :theme="getMenuTheme"
    @breakpoint="onBreakpointChange"
  >
    <LayoutMenu />
  </a-layout-sider>
</template>
<script lang="ts">
  import { computed, defineComponent, ref, unref, CSSProperties, h } from 'vue';

  import LayoutMenu from '../menu/index.vue';

  import { useDesign } from '@/hooks/web/useDesign';
  import { useAppInject } from '@/hooks/web/useAppInject';
  import { useMenuSetting } from '@/hooks/setting/useMenuSetting';

  import { useSiderEvent } from './useLayoutSider';

  export default defineComponent({
    name: 'LayoutSideBar',
    components: {
      LayoutMenu,
    },
    setup() {
      const { prefixCls } = useDesign('layout-sideBar');
      const { getIsMobile } = useAppInject();

      const {
        getSplit,
        getMenuHidden,
        getRealWidth,
        getMenuFixed,
        getIsMixMode,
        getMenuWidth,
        getCollapsed,
        getMenuTheme,
      } = useMenuSetting();

      // 折叠菜单后的宽度
      const { getCollapsedWidth, onBreakpointChange } = useSiderEvent();

      // 左侧菜单fixed布局时，使用div进行占位
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

      //分割菜单且隐藏时，则占位div也隐藏
      const showClassSideBarRef = computed(() => {
        return unref(getSplit) ? !unref(getMenuHidden) : true;
      });

      const getSiderClass = computed(() => {
        return [
          prefixCls,
          {
            [`${prefixCls}--fixed`]: unref(getMenuFixed), //固定左侧菜单样式
            [`${prefixCls}--mix`]: unref(getIsMixMode) && !unref(getIsMobile), //顶部菜单混合模式的样式
          },
        ];
      });

      return {
        getIsMobile,
        getMenuFixed,
        getHiddenDomStyle,
        getSiderClass,
        getMenuTheme,
        getMenuWidth,
        showClassSideBarRef,
        getCollapsed,
        getCollapsedWidth,
        onBreakpointChange,
      };
    },
  });
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-layout-sideBar';

  .@{prefix-cls} {
    z-index: @layout-sider-fixed-z-index;
    // 固定左侧菜单样式
    &--fixed {
      position: fixed;
      top: 0;
      left: 0;
      height: 100%;
    }

    &--mix {
      top: @header-height;
      height: calc(100% - @header-height);
    }

    &.ant-layout-sider-dark {
      background-color: @sider-dark-bg-color;

      .ant-layout-sider-trigger {
        color: darken(@white, 25%);
        background-color: @trigger-dark-bg-color;

        &:hover {
          color: @white;
          background-color: @trigger-dark-hover-bg-color;
        }
      }
    }

    &:not(.ant-layout-sider-dark) {
      // box-shadow: 2px 0 8px 0 rgba(29, 35, 41, 0.05);

      .ant-layout-sider-trigger {
        color: @text-color-base;
        border-top: 1px solid @border-color-light;
      }
    }
  }
</style>
