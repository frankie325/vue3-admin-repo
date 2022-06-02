<template>
  <div :style="getPlaceholderDomStyle" v-if="getIsShowPlaceholderDom"></div>
  <div :style="getWrapStyle" :class="getClass">
    <LayoutHeader v-if="getShowInsetHeaderRef" />
    <MultipleTabs v-if="getShowTabs" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, unref, computed, CSSProperties } from 'vue';

  import LayoutHeader from './index.vue';
  import MultipleTabs from '../tabs/index.vue';

  import { useDesign } from '@/hooks/web/useDesign';
  import { useAppInject } from '@/hooks/web/useAppInject';
  import { useHeaderSetting } from '@/hooks/setting/useHeaderSetting';
  import { useMenuSetting } from '@/hooks/setting/useMenuSetting';
  import { useMultipleTabSetting } from '@/hooks/setting/useMultipleTabSetting';
  import { useFullContent } from '@/hooks/web/useFullContent';
  import { useLayoutHeight } from '../content/useContentViewHeight';

  const HEADER_HEIGHT = 48;

  const TABS_HEIGHT = 32;

  export default defineComponent({
    name: 'LayoutMultipleHeader',
    components: { LayoutHeader, MultipleTabs },
    setup() {
      const { setHeaderHeight } = useLayoutHeight();

      const { prefixCls } = useDesign('layout-multiple-header');
      const { getIsMobile } = useAppInject();

      const { getFullContent } = useFullContent();

      const { getShowMultipleTab } = useMultipleTabSetting();

      const {
        getFixed,
        getShowInsetHeaderRef,
        getShowFullHeaderRef,
        getHeaderTheme,
        getShowHeader,
      } = useHeaderSetting();

      const { getCalcContentWidth, getSplit } = useMenuSetting();

      // 是否显示标签页
      const getShowTabs = computed(() => {
        return unref(getShowMultipleTab) && !unref(getFullContent);
      });
      const getWrapStyle = computed((): CSSProperties => {
        const style: CSSProperties = {};
        if (unref(getFixed)) {
          // 移动端时，头部宽度100%否则动态根据左侧菜单计算头部宽度
          style.width = unref(getIsMobile) ? '100%' : unref(getCalcContentWidth);
        }
        if (unref(getShowFullHeaderRef)) {
          style.top = `${HEADER_HEIGHT}px`;
        }
        return style;
      });

      // 决定头部使用fixed布局
      const getIsFixed = computed(() => {
        return unref(getFixed) || unref(getShowFullHeaderRef);
      });

      const getClass = computed(() => {
        return [
          prefixCls,
          `${prefixCls}--${unref(getHeaderTheme)}`,
          { [`${prefixCls}--fixed`]: unref(getIsFixed) },
        ];
      });

      // 当头部为fixed布局使用头部占位div
      const getIsShowPlaceholderDom = computed(() => {
        //  return unref(getFixed) || unref(getShowFullHeaderRef);
        return unref(getIsFixed);
      });

      // 头部使用fixed布局时的占位高度
      const getPlaceholderDomStyle = computed((): CSSProperties => {
        let height = 0;
        // 显示头部则加上头部的高度
        if (
          (unref(getShowFullHeaderRef) || !unref(getSplit)) &&
          unref(getShowHeader) &&
          !unref(getFullContent)
        ) {
          height += HEADER_HEIGHT;
        }
        // 显示标签页则加上标签页高度
        if (unref(getShowMultipleTab) && !unref(getFullContent)) {
          height += TABS_HEIGHT;
        }
        setHeaderHeight(height);
        return {
          height: `${height}px`,
        };
      });

      return {
        getWrapStyle,
        getClass,
        getShowInsetHeaderRef,
        getIsShowPlaceholderDom,
        getPlaceholderDomStyle,
        getShowTabs,
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-layout-multiple-header';

  .@{prefix-cls} {
    transition: width 0.2s;
    flex: 0 0 auto;

    &--dark {
      margin-left: -1px;
    }

    &--fixed {
      position: fixed;
      top: 0;
      z-index: @multiple-tab-fixed-z-index;
      width: 100%;
    }
  }
</style>
