import type { Ref } from 'vue';
import { ref, watch, unref } from 'vue';
import { useThrottleFn, useDebounceFn } from '@vueuse/core';

export type RemoveEventFn = () => void;

export interface UseEventParams {
  el?: Element | Ref<Element> | Window;
  name: string; // 监听事件名称
  listener: EventListener;
  options?: boolean | AddEventListenerOptions;
  autoRemove?: boolean; // 手动调用removeWatch或者element变化或者组件卸载时，是否要移除监听事件
  isDebounce?: boolean; // 是否使用防抖，否则使用节流
  wait?: number; //防抖和节流的事件间隔
}

/**
 * @description: 注册监听事件方法
 * @return {*} 返回移除监听事件的方法
 */
export function useEventListener({
  el = window,
  name,
  listener,
  options,
  autoRemove = true,
  isDebounce = true,
  wait = 80,
}: UseEventParams): { removeEvent: RemoveEventFn } {
  let remove: RemoveEventFn = () => {};

  const isAddRef = ref(false);

  if (el) {
    const element = ref(el as Element) as Ref<Element>;

    const handler = isDebounce ? useDebounceFn(listener, wait) : useThrottleFn(listener, wait);
    const realHandler = wait ? handler : listener; //如果wait小于等于0，则不使用防抖节流

    // 添加事件监听
    const addEventListener = (e: Element) => e.addEventListener(name, realHandler, options);

    // 移除事件监听
    const removeEventListener = (e: Element) => {
      isAddRef.value = true;
      e.removeEventListener(name, realHandler, options);
    };

    const removeWatch = watch(
      element,
      (v, ov, cleanUp) => {
        if (v) {
          !unref(isAddRef) && addEventListener(v);

          // 手动调用removeWatch或者element变化或者组件卸载时，调用清除副作用，移除监听
          cleanUp(() => {
            autoRemove && removeEventListener(v);
          });
        }
      },
      { immediate: true },
    );

    remove = () => {
      removeEventListener(element.value);
      removeWatch();
    };
  }
  return { removeEvent: remove };
}
