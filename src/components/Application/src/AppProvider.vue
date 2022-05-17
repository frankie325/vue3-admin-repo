<script lang="ts">
  import { defineComponent, toRefs, ref, unref } from 'vue';
  import { createAppProviderContext } from './useAppContext';
  import { createBreakpointListen } from '@/hooks/event/useBreakpoint';
  import { prefixCls } from '@/settings/designSetting';
  import { useAppStore } from '@/store/modules/app';

  export default defineComponent({
    name: 'AppProvider',
    inheritAttrs: false,
    props: {
      prefixCls: { type: String, default: prefixCls },
    },
    setup(props, { slots }) {
      const isMobile = ref(false);
      const isSetState = ref(false);
      const appStore = useAppStore();

      // 监听浏览器宽度的变化
      createBreakpointListen(({ screenMap, sizeEnum, width }) => {
        const lgWidth = screenMap.get(sizeEnum.LG);
        // 当断点宽度小于等于LG时，为移动端
        if (lgWidth) {
          isMobile.value = width.value <= lgWidth;
        }
        handleRestoreState();
      });

      const { prefixCls } = toRefs(props);

      // 将这两个属性注入到上下文（注入到该组件）
      createAppProviderContext({ prefixCls, isMobile });

      function handleRestoreState() {
        if (unref(isMobile)) {
          if (!unref(isSetState)) {
            isSetState.value = true;
          }
        } else {
        }
      }

      return () => slots.default?.();
    },
  });
</script>
