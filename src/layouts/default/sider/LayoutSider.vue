<template>
  <div v-if="getMenuFixed && !getIsMobile" :style="getHiddenDomStyle" v-show="showClassSideBarRef">
  </div>
  <a-layout-sider v-show="showClassSideBarRef" :class="getSiderClass" :width="getMenuWidth"
    >sider</a-layout-sider
  >
</template>
<script lang="ts">
  import { computed, defineComponent, ref, unref, CSSProperties, h } from 'vue';

  import { useDesign } from '@/hooks/web/useDesign';
  import { useAppInject } from '@/hooks/web/useAppInject';

  import { useMenuSetting } from '@/hooks/setting/useMenuSetting';

  export default defineComponent({
    name: 'LayoutSideBar',
    setup() {
      const { prefixCls } = useDesign('layout-sideBar');
      const { getIsMobile } = useAppInject();

      const { getSplit, getMenuHidden, getRealWidth, getMenuFixed, getIsMixMode, getMenuWidth } =
        useMenuSetting();

      // 因为左侧菜单时fixed布局，使用div进行占位
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
        getMenuWidth,
        showClassSideBarRef,
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
  }
</style>
