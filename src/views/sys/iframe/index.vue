<template>
  <div :class="prefixCls" :style="getWrapStyle">
    <a-spin :spinning="loading" size="large" :style="getWrapStyle">
      <iframe
        :src="frameSrc"
        :class="`${prefixCls}__main`"
        ref="frameRef"
        @load="hideLoading"
      ></iframe>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
  import type { CSSProperties } from 'vue';
  import { ref, unref, computed } from 'vue';
  import { propTypes } from '@/utils/propTypes';
  import { useWindowSizeFn } from '@/hooks/event/useWindowSizeFn';
  import { useDesign } from '@/hooks/web/useDesign';
  import { useLayoutHeight } from '@/layouts/default/content/useContentViewHeight';

  defineProps({
    frameSrc: propTypes.string.def(''),
  });

  const loading = ref(true);
  const topRef = ref(50);
  const heightRef = ref(window.innerHeight);
  const frameRef = ref<HTMLFrameElement>();
  const { headerHeightRef } = useLayoutHeight();
  const { prefixCls } = useDesign('iframe-page');
  // @ts-ignore
  useWindowSizeFn(calcHeight, 150, { immediate: true });

  const getWrapStyle = computed((): CSSProperties => {
    return {
      height: `${unref(heightRef)}px`,
    };
  });

  /**
   * @description: 计算iframe标签高度
   */
  function calcHeight() {
    const iframe = unref(frameRef);
    if (!iframe) {
      return;
    }
    const top = headerHeightRef.value; // 头部高度
    topRef.value = top;
    heightRef.value = window.innerHeight - top; // iframe容器高度
    const clientHeight = document.documentElement.clientHeight - top;
    iframe.style.height = `${clientHeight}px`; // iframe标签高度
  }

  // iframe加载完成，关闭loading动画
  function hideLoading() {
    loading.value = false;
    calcHeight();
  }
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-iframe-page';

  .@{prefix-cls} {
    .ant-spin-nested-loading {
      position: relative;
      height: 100%;

      .ant-spin-container {
        width: 100%;
        height: 100%;
        padding: 10px;
      }
    }

    &__mask {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    &__main {
      width: 100%;
      height: 100%;
      overflow: hidden;
      background-color: @component-background;
      border: 0;
      box-sizing: border-box;
    }
  }
</style>
