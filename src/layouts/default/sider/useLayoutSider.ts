import type { Ref } from 'vue';

import { computed, unref, onMounted, nextTick, ref } from 'vue';
import { useMenuSetting } from '@/hooks/setting/useMenuSetting';
import { TriggerEnum } from '@/enums/menuEnum';
import { useDebounceFn } from '@vueuse/core';

export function useSiderEvent() {
  const brokenRef = ref(false);
  const { getMiniWidthNumber } = useMenuSetting();

  // 折叠时菜单宽度
  const getCollapsedWidth = computed(() => {
    return unref(brokenRef) ? 0 : unref(getMiniWidthNumber);
  });

  // 当屏幕断点在lg之间变化时，触发回调，小于lg返回true，则左侧fixed布局固定的菜单设为0
  function onBreakpointChange(broken: boolean) {
    brokenRef.value = broken;
  }

  return { getCollapsedWidth, onBreakpointChange };
}

export function useTrigger(getIsMobile: Ref<boolean>) {
  const { getTrigger, getSplit } = useMenuSetting();

  // 是否显示自定义折叠按钮
  const getShowTrigger = computed(() => {
    const trigger = unref(getTrigger);

    return (
      trigger !== TriggerEnum.NONE &&
      !unref(getIsMobile) &&
      (trigger === TriggerEnum.FOOTER || unref(getSplit))
    );
  });

  const getTriggerAttr = computed(() => {
    if (unref(getShowTrigger)) {
      return {};
    }
    return {
      trigger: null,
    };
  });

  return { getTriggerAttr, getShowTrigger };
}

/**
 * @description  拖拽以修改菜单容器宽度
 * @param siderRef 目标元素
 * @param dragBarRef 拖拽元素
 */
export function useDragLine(siderRef: Ref<any>, dragBarRef: Ref<any>, mix = false) {
  const { getMiniWidthNumber, getCollapsed, setMenuSetting } = useMenuSetting();

  onMounted(() => {
    nextTick(() => {
      const exec = useDebounceFn(changeWrapWidth, 80);
      exec();
    });
  });

  function getEl(elRef: Ref<ElRef | ComponentRef>): any {
    const el = unref(elRef);
    if (!el) return null;
    if (Reflect.has(el, '$el')) {
      return (unref(elRef) as ComponentRef)?.$el;
    }
    return unref(elRef);
  }

  function handleMouseMove(ele: HTMLElement, wrap: HTMLElement, clientX: number) {
    document.onmousemove = function (innerE) {
      let iT = (ele as any).left + (innerE.clientX - clientX);
      innerE = innerE || window.event;
      const maxT = 800;
      const minT = unref(getMiniWidthNumber);
      iT < 0 && (iT = 0);
      iT > maxT && (iT = maxT);
      iT < minT && (iT = minT);
      ele.style.left = wrap.style.width = iT + 'px';
      return false;
    };
  }

  // Drag and drop in the menu area-release the mouse
  function removeMouseup(ele: any) {
    const wrap = getEl(siderRef);
    document.onmouseup = function () {
      document.onmousemove = null;
      document.onmouseup = null;
      wrap.style.transition = 'width 0.2s';
      const width = parseInt(wrap.style.width);

      if (!mix) {
        const miniWidth = unref(getMiniWidthNumber);
        if (!unref(getCollapsed)) {
          width > miniWidth + 20
            ? setMenuSetting({ menuWidth: width })
            : setMenuSetting({ collapsed: true });
        } else {
          width > miniWidth && setMenuSetting({ collapsed: false, menuWidth: width });
        }
      } else {
        setMenuSetting({ menuWidth: width });
      }

      ele.releaseCapture?.();
    };
  }

  function changeWrapWidth() {
    const ele = getEl(dragBarRef);
    if (!ele) return;
    const wrap = getEl(siderRef);
    if (!wrap) return;

    ele.onmousedown = (e: any) => {
      wrap.style.transition = 'unset';
      const clientX = e?.clientX;
      ele.left = ele.offsetLeft;
      handleMouseMove(ele, wrap, clientX);
      removeMouseup(ele);
      ele.setCapture?.();
      return false;
    };
  }

  return {};
}
