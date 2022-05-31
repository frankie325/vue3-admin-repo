<template>
  <div v-if="getMenuFixed && !getIsMobile" :style="getHiddenDomStyle" v-show="showClassSideBarRef">
  </div>
  <a-layout-sider
    v-show="showClassSideBarRef"
    ref="sideRef"
    breakpoint="lg"
    collapsible
    :class="getSiderClass"
    :width="getMenuWidth"
    :collapsed="getCollapsed"
    :collapsedWidth="getCollapsedWidth"
    :theme="getMenuTheme"
    @breakpoint="onBreakpointChange"
    v-bind="getTriggerAttr"
  >
    <template #trigger v-if="getShowTrigger">
      <LayoutTrigger />
    </template>
    <LayoutMenu :theme="getMenuTheme" :menuMode="getMode" :splitType="getSplitType" />
    <DragBar ref="dragBarRef" />
  </a-layout-sider>
</template>
<script lang="ts">
  import { computed, defineComponent, ref, unref, CSSProperties, h } from 'vue';

  import LayoutMenu from '../menu/index.vue';
  import LayoutTrigger from '@/layouts/default/trigger/index.vue';
  import DragBar from './DragBar.vue';

  import { useDesign } from '@/hooks/web/useDesign';
  import { useAppInject } from '@/hooks/web/useAppInject';
  import { useMenuSetting } from '@/hooks/setting/useMenuSetting';

  import { useTrigger, useSiderEvent, useDragLine } from './useLayoutSider';
  import { MenuModeEnum, MenuSplitTyeEnum } from '@/enums/menuEnum';

  export default defineComponent({
    name: 'LayoutSideBar',
    components: {
      LayoutMenu,
      LayoutTrigger,
      DragBar,
    },
    setup() {
      const { prefixCls } = useDesign('layout-sideBar');
      const { getIsMobile } = useAppInject();

      const dragBarRef = ref<ElRef>(null);
      const sideRef = ref<ElRef>(null);

      const { getTriggerAttr, getShowTrigger } = useTrigger(getIsMobile);

      // 拖拽以修改菜单容器宽度
      useDragLine(sideRef, dragBarRef);

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

      // 如果分割菜单，则菜单模式为INLINE
      const getMode = computed(() => {
        return unref(getSplit) ? MenuModeEnum.INLINE : null;
      });

      // 如果分割菜单，则分割菜单类型为LEFT
      const getSplitType = computed(() => {
        return unref(getSplit) ? MenuSplitTyeEnum.LEFT : MenuSplitTyeEnum.NONE;
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
        getSplitType,
        getMode,
        getShowTrigger,
        getTriggerAttr,
        sideRef,
        dragBarRef,
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
