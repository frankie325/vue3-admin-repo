import { ref, computed, ComputedRef, unref } from 'vue';
import { useEventListener } from '@/hooks/event/useEventListener';
import { screenMap, sizeEnum, screenEnum } from '@/enums/breakpointEnum';

let globalScreenRef: ComputedRef<sizeEnum | undefined>; //当前屏幕断点
let globalWidthRef: ComputedRef<number>; //当前屏幕断点对应的宽度
let globalRealWidthRef: ComputedRef<number>; //当前浏览器可视区域的真实宽度

export interface CreateCallbackParams {
  screen: ComputedRef<sizeEnum | undefined>;
  width: ComputedRef<number>;
  realWidth: ComputedRef<number>;
  screenEnum: typeof screenEnum;
  screenMap: Map<sizeEnum, number>;
  sizeEnum: typeof sizeEnum;
}

/**
 * @description: 监听浏览器宽度的变化，将值保存在全局变量中
 */
export function createBreakpointListen(fn?: (opt: CreateCallbackParams) => void) {
  const screenRef = ref<sizeEnum>(sizeEnum.XL);
  const realWidthRef = ref(window.innerWidth);

  // 当浏览器宽度的变化时，更新当前屏幕断点的值
  function getWindowWidth() {
    const width = document.body.clientWidth;
    const xs = screenMap.get(sizeEnum.XS)!;
    const sm = screenMap.get(sizeEnum.SM)!;
    const md = screenMap.get(sizeEnum.MD)!;
    const lg = screenMap.get(sizeEnum.LG)!;
    const xl = screenMap.get(sizeEnum.XL)!;
    if (width < xs) {
      screenRef.value = sizeEnum.XS;
    } else if (width < sm) {
      screenRef.value = sizeEnum.SM;
    } else if (width < md) {
      screenRef.value = sizeEnum.MD;
    } else if (width < lg) {
      screenRef.value = sizeEnum.LG;
    } else if (width < xl) {
      screenRef.value = sizeEnum.XL;
    } else {
      screenRef.value = sizeEnum.XXL;
    }
    realWidthRef.value = width;
  }

  // 监听resize事件
  useEventListener({
    el: window,
    name: 'resize',

    listener: () => {
      getWindowWidth();
      resizeFn();
    },
  });

  getWindowWidth();
  globalScreenRef = computed(() => unref(screenRef));
  globalWidthRef = computed((): number => screenMap.get(unref(screenRef)!)!);
  globalRealWidthRef = computed((): number => unref(realWidthRef));

  // 将新的值通过回调方法参数传出去
  function resizeFn() {
    fn?.({
      screen: globalScreenRef,
      width: globalWidthRef,
      realWidth: globalRealWidthRef,
      screenEnum,
      screenMap,
      sizeEnum,
    });
  }

  resizeFn();
  return {
    screenRef: globalScreenRef,
    screenEnum,
    widthRef: globalWidthRef,
    realWidthRef: globalRealWidthRef,
  };
}
