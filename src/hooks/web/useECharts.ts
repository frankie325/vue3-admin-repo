import type { EChartsOption } from 'echarts';
import type { Ref } from 'vue';

import { unref, nextTick, watch, computed, ref } from 'vue';
import { tryOnUnmounted } from '@vueuse/core';
import { useDebounceFn } from '@vueuse/core';

import echarts from '@/utils/lib/echarts';
import { useRootSetting } from '@/hooks/setting/useRootSetting';
import { useTimeoutFn } from '@/hooks/core/useTimeout';
import { useBreakpoint } from '@/hooks/event/useBreakpoint';
import { useEventListener } from '../event/useEventListener';

export function useECharts(
  elRef: Ref<HTMLElement>,
  theme: 'light' | 'dark' | 'default' = 'default',
) {
  const { getDarkMode: getSysDarkMode } = useRootSetting();
  // 获取系统主题
  const getDarkMode = computed(() => {
    return theme === 'default' ? getSysDarkMode.value : theme;
  });

  let chartInstance: echarts.ECharts | null = null;

  function resize() {
    chartInstance?.resize();
  }

  let removeResizeFn: Fn = () => {};
  let resizeFn: Fn = resize;
  resizeFn = useDebounceFn(resize, 200);

  // 初始化echarts实例
  function initCharts(t = theme) {
    const el = unref(elRef);
    if (!el || !unref(el)) {
      return;
    }

    chartInstance = echarts.init(el, t);
    // 监听resize事件，屏幕宽度变化时，echarts跟随变化
    const { removeEvent } = useEventListener({
      el: window,
      name: 'resize',
      listener: resizeFn,
    });
    removeResizeFn = removeEvent;

    const { widthRef, screenEnum } = useBreakpoint();
    if (unref(widthRef) <= screenEnum.MD || el.offsetHeight === 0) {
      useTimeoutFn(() => {
        resizeFn();
      }, 30);
    }
  }

  const cacheOptions = ref({}) as Ref<EChartsOption>;

  // 处理echarts选项
  const getOptions = computed(() => {
    if (getDarkMode.value !== 'dark') {
      return cacheOptions.value as EChartsOption;
    }
    // 如果是黑暗模式，修改背景色
    return {
      backgroundColor: 'transparent',
      ...cacheOptions.value,
    } as EChartsOption;
  });

  function setOptions(options: EChartsOption, clear = true) {
    cacheOptions.value = options;

    // 如果元素高度为0，则等会再调用自己
    if (unref(elRef)?.offsetHeight === 0) {
      useTimeoutFn(() => {
        setOptions(unref(getOptions));
      }, 30);
      return;
    }

    nextTick(() => {
      useTimeoutFn(() => {
        // echarts实例还没创建，则创建echarts实例
        if (!chartInstance) {
          initCharts(getDarkMode.value as 'default');

          if (!chartInstance) return;
        }
        clear && chartInstance?.clear();

        // 设置echarts选项
        chartInstance?.setOption(unref(getOptions));
      }, 30);
    });
  }

  // 黑暗模式切换时调用
  watch(
    () => getDarkMode.value,
    (theme) => {
      if (chartInstance) {
        chartInstance.dispose(); //销毁echarts实例
        initCharts(theme as 'default');
        setOptions(cacheOptions.value);
      }
    },
  );

  // 组件销毁时调用
  tryOnUnmounted(() => {
    if (!chartInstance) return;
    removeResizeFn();
    chartInstance.dispose();
    chartInstance = null;
  });

  // 获取echarts实例
  function getInstance(): echarts.ECharts | null {
    if (!chartInstance) {
      initCharts(getDarkMode.value as 'default');
    }
    return chartInstance;
  }

  return {
    setOptions,
    resize,
    echarts,
    getInstance,
  };
}
