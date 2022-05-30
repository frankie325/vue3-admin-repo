<template>
  <ul :class="getClass">
    <slot></slot>
  </ul>
</template>

<script lang="ts">
  import type { PropType } from 'vue';
  import type { SubMenuProvider } from './types';

  import {
    defineComponent,
    ref,
    computed,
    onMounted,
    watchEffect,
    watch,
    nextTick,
    getCurrentInstance,
    provide,
  } from 'vue';

  import { useDesign } from '@/hooks/web/useDesign';
  import { propTypes } from '@/utils/propTypes';
  import { createSimpleRootMenuContext } from './useSimpleMenuContext';
  import mitt from '@/utils/mitt';

  export default defineComponent({
    name: 'Menu',
    props: {
      theme: propTypes.oneOf(['light', 'dark']).def('light'),
      activeName: propTypes.oneOfType([propTypes.string, propTypes.number]),
      // 展开的菜单lujing
      openNames: {
        type: Array as PropType<string[]>,
        default: () => [],
      },
      accordion: propTypes.bool.def(true),
      width: propTypes.string.def('100%'),
      collapsedWidth: propTypes.string.def('48px'),
      indentSize: propTypes.number.def(16), //计算嵌套子菜单的paddingLeft用到
      collapse: propTypes.bool.def(true),
      activeSubMenuNames: {
        type: Array as PropType<(string | number)[]>,
        default: () => [],
      },
    },
    emits: ['select', 'open-change'],
    setup(props, { emit }) {
      const rootMenuEmitter = mitt();
      const currentActiveName = ref<string | number>('');

      const openedNames = ref<string[]>([]); //控制popover展开的菜单

      // 注入数据
      createSimpleRootMenuContext({
        rootMenuEmitter: rootMenuEmitter, // 事件触发器
        activeName: currentActiveName, // 当前激活菜单
      });

      // 监听展开菜单的变化
      watchEffect(() => {
        openedNames.value = props.openNames;
      });

      // 激活菜单的变化
      watchEffect(() => {
        if (props.activeName) {
          currentActiveName.value = props.activeName;
        }
      });

      watch(
        () => props.openNames,
        () => {
          nextTick(() => {
            updateOpened();
          });
        },
      );

      const instance = getCurrentInstance();

      const isRemoveAllPopup = ref(false);
      const { prefixCls } = useDesign('menu');

      const getClass = computed(() => {
        const { theme } = props;
        return [
          prefixCls,
          `${prefixCls}-${theme}`,
          `${prefixCls}-vertical`,
          {
            [`${prefixCls}-collapse`]: props.collapse,
          },
        ];
      });

      function updateOpened() {
        rootMenuEmitter.emit('on-update-opened', openedNames.value);
      }

      function addSubMenu(name: string) {
        if (openedNames.value.includes(name)) return;
        openedNames.value.push(name);
        updateOpened();
      }

      function removeSubMenu(name: string) {
        openedNames.value = openedNames.value.filter((item) => item !== name);
        updateOpened();
      }

      function removeAll() {
        openedNames.value = [];
        updateOpened();
      }

      function sliceIndex(index: number) {
        if (index === -1) return;
        openedNames.value = openedNames.value.slice(0, index + 1);
        updateOpened();
      }

      // 注入如下属性
      provide<SubMenuProvider>(`subMenu:${instance?.uid}`, {
        //@ts-ignore
        addSubMenu,
        //@ts-ignore
        removeSubMenu,
        getOpenNames: () => openedNames.value, // 获取openedNames，嵌套子菜单使用
        removeAll,
        isRemoveAllPopup,
        sliceIndex,
        level: 0,
        props: props as any,
      });

      onMounted(() => {
        openedNames.value = !props.collapse ? [...props.openNames] : [];
        updateOpened();

        // 子菜单选中事件
        rootMenuEmitter.on('on-menu-item-select', (name: string) => {
          currentActiveName.value = name;

          nextTick(() => {
            props.collapse && removeAll();
          });
          emit('select', name);
        });

        // 展开的菜单变化了
        rootMenuEmitter.on('open-name-change', ({ name, opened }) => {
          if (opened && !openedNames.value.includes(name)) {
            // 展开时，将菜单path推入到openedNames数组
            openedNames.value.push(name);
          } else if (!opened) {
            // 收起时，则从数组移除
            const index = openedNames.value.findIndex((item) => item === name);
            index !== -1 && openedNames.value.splice(index, 1);
          }
        });
      });
      return { getClass };
    },
  });
</script>

<style lang="less">
  @import './menu.less';
</style>
