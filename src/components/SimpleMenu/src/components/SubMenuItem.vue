<template>
  <li :class="getClass">
    <!-- 没折叠菜单时渲染 -->
    <template v-if="!getCollapse">
      <div :class="`${prefixCls}-submenu-title`" @click.stop="handleClick" :style="getItemStyle">
        <slot name="title"></slot>
        <Icon
          icon="eva:arrow-ios-downward-outline"
          :size="14"
          :class="`${prefixCls}-submenu-title-icon`"
        />
      </div>
      <CollapseTransition>
        <ul :class="prefixCls" v-show="opened">
          <slot></slot>
        </ul>
      </CollapseTransition>
    </template>
    <!-- 折叠菜单时渲染 -->
    <a-popover
      v-else
      placement="right"
      :overlayClassName="`${prefixCls}-menu-popover`"
      :overlayStyle="getOverlayStyle"
      :align="{ offset: [0, 0] }"
      :visible="getIsOpend"
      @visible-change="handleVisibleChange"
    >
      <div :class="getSubClass" v-bind="getEvents(false)">
        <div
          :class="[
            {
              [`${prefixCls}-submenu-popup`]: !getParentSubMenu,
              [`${prefixCls}-submenu-collapsed-show-tit`]: collapsedShowTitle,
            },
          ]"
        >
          <slot name="title"></slot>
        </div>
        <Icon
          v-if="getParentSubMenu"
          icon="eva:arrow-ios-downward-outline"
          :size="14"
          :class="`${prefixCls}-submenu-title-icon`"
        />
      </div>
      <!-- eslint-disable-next-line -->
      <template #content v-show="opened">
        <div v-bind="getEvents(true)">
          <ul :class="[prefixCls, `${prefixCls}-${getTheme}`, `${prefixCls}-popup`]">
            <slot></slot>
          </ul>
        </div>
      </template>
    </a-popover>
  </li>
</template>
<script lang="ts">
  import type { CSSProperties, PropType } from 'vue';
  import type { SubMenuProvider } from './types';

  import {
    defineComponent,
    computed,
    unref,
    getCurrentInstance,
    toRefs,
    reactive,
    provide,
    onBeforeMount,
    inject,
  } from 'vue';

  import { CollapseTransition } from '@/components/Transition';
  import Icon from '@/components/Icon';

  import { useDesign } from '@/hooks/web/useDesign';
  import { propTypes } from '@/utils/propTypes';
  import { useMenuItem } from './useMenu';
  import { useSimpleRootMenuContext } from './useSimpleMenuContext';
  import { isBoolean, isObject } from '@/utils/is';
  import mitt from '@/utils/mitt';

  const DELAY = 200;
  export default defineComponent({
    name: 'SubMenu',
    components: {
      CollapseTransition,
      Icon,
    },
    props: {
      name: {
        type: [String, Number] as PropType<string | number>,
        required: true,
      },
      disabled: propTypes.bool,
      collapsedShowTitle: propTypes.bool,
    },
    setup(props) {
      const instance = getCurrentInstance();
      const { prefixCls } = useDesign('menu');

      const { getParentSubMenu, getItemStyle, getParentMenu, getParentList } =
        useMenuItem(instance);

      const { rootMenuEmitter } = useSimpleRootMenuContext();

      const subMenuEmitter = mitt();

      // 获取从父级Menu或者FSubMenu注入的数据
      const {
        addSubMenu: parentAddSubmenu,
        removeSubMenu: parentRemoveSubmenu,
        removeAll: parentRemoveAll,
        getOpenNames: parentGetOpenNames,
        isRemoveAllPopup,
        sliceIndex,
        level,
        props: rootProps,
        handleMouseleave: parentHandleMouseleave,
      } = inject<SubMenuProvider>(`subMenu:${getParentMenu.value?.uid}`)!;

      const state = reactive({
        active: false,
        opened: false,
      });

      const data = reactive({
        timeout: null as TimeoutHandle | null,
        mouseInChild: false,
        isChild: false,
      });

      // 是否折叠菜单
      const getCollapse = computed(() => rootProps.collapse);
      const getTheme = computed(() => rootProps.theme);
      const getAccordion = computed(() => rootProps.accordion);

      const getClass = computed(() => {
        return [
          `${prefixCls}-submenu`,
          {
            [`${prefixCls}-item-active`]: state.active, //菜单激活样式
            [`${prefixCls}-opened`]: state.opened, // 展开菜单图标样式
            [`${prefixCls}-submenu-disabled`]: props.disabled,
            [`${prefixCls}-submenu-has-parent-submenu`]: unref(getParentSubMenu),
            [`${prefixCls}-child-item-active`]: state.active,
          },
        ];
      });

      // popover中的菜单样式
      const getSubClass = computed(() => {
        const isActive = rootProps.activeSubMenuNames.includes(props.name);
        return [
          `${prefixCls}-submenu-title`,
          {
            [`${prefixCls}-submenu-active`]: isActive,
            [`${prefixCls}-submenu-active-border`]: isActive && level === 0,
            [`${prefixCls}-submenu-collapse`]: unref(getCollapse) && level === 0,
          },
        ];
      });

      // 悬浮层宽度
      const getOverlayStyle = computed((): CSSProperties => {
        return {
          minWidth: '200px',
        };
      });

      // 手动控制popover显隐
      const getIsOpend = computed(() => {
        const name = props.name;
        if (unref(getCollapse)) {
          // 菜单路径存在于openedName中才会显示
          return parentGetOpenNames().includes(name);
        }
        return state.opened;
      });

      // 点击菜单
      function handleClick() {
        const { disabled } = props;
        if (disabled || unref(getCollapse)) return;
        const opened = state.opened;

        if (unref(getAccordion)) {
          // 如果是手风琴模式
          const { uidList } = getParentList();

          rootMenuEmitter.emit('on-update-opened', {
            opend: false,
            parent: instance?.parent,
            uidList: uidList,
          });
        } else {
          // 非手风琴模式
          rootMenuEmitter.emit('open-name-change', {
            name: props.name,
            opened: !opened,
          });
        }

        state.opened = !opened;
      }

      // 绑定鼠标移入移出事件
      function getEvents(deep: boolean) {
        if (!unref(getCollapse)) {
          return {};
        }
        return {
          onMouseenter: handleMouseenter,
          onMouseleave: () => handleMouseleave(deep),
        };
      }

      // 折叠菜单后，openedNames数组肯定是空的
      function handleMouseenter() {
        const disabled = props.disabled;
        if (disabled) return;

        subMenuEmitter.emit('submenu:mouse-enter-child');

        // 移到popover时，为同一个SubMenu实例
        const index = parentGetOpenNames().findIndex((item) => item === props.name);

        sliceIndex(index);

        const isRoot = level === 0 && parentGetOpenNames().length === 2;
        if (isRoot) {
          parentRemoveAll();
        }
        data.isChild = parentGetOpenNames().includes(props.name);
        clearTimeout(data.timeout!);
        /*
        鼠标移入和移出时
        如果移入悬浮时间大于200ms，则先执行下面的定时任务
        如果很快的移入又移出，小于200ms，则在handleMouseleave中定时任务已经清除，不会执行
         */
        data.timeout = setTimeout(() => {
          // 将菜单的路径添加到openedName中
          parentAddSubmenu(props.name);
        }, DELAY);
      }

      function handleMouseleave(deepDispatch = false) {
        const parentName = getParentMenu.value?.props.name;
        if (!parentName) {
          isRemoveAllPopup.value = true;
        }

        if (parentGetOpenNames().slice(-1)[0] === props.name) {
          data.isChild = false;
        }

        subMenuEmitter.emit('submenu:mouse-leave-child');

        if (data.timeout) {
          clearTimeout(data.timeout!);

          /**
           *  鼠标移入和移出时
           *  如果移出时又很快移入，则不会将菜单从openedName中剔除，因为在handleMouseenter中会清除下面的定时任务
           */
          data.timeout = setTimeout(() => {
            if (isRemoveAllPopup.value) {
              parentRemoveAll();
            } else if (!data.mouseInChild) {
              parentRemoveSubmenu(props.name);
            }
          }, DELAY);
        }

        // 直接从子菜单移出，则调用父级handleMouseleave，将父级从openedName中移出
        if (deepDispatch) {
          if (getParentSubMenu.value) {
            parentHandleMouseleave?.(true);
          }
        }
      }

      onBeforeMount(() => {
        /**
         一个嵌套菜单就是一个SubMenu组件
         当鼠标从父菜单移入到子菜单时，执行顺序为父级菜单的mouseLeave => 子菜单的
         */
        subMenuEmitter.on('submenu:mouse-enter-child', () => {
          data.mouseInChild = true;
          isRemoveAllPopup.value = false;
          clearTimeout(data.timeout!);
        });

        subMenuEmitter.on('submenu:mouse-leave-child', () => {
          if (data.isChild) return;
          data.mouseInChild = false;
          clearTimeout(data.timeout!);
        });

        // openedNames改变时触发
        rootMenuEmitter.on(
          'on-update-opened',
          (data: boolean | (string | number)[] | Recordable) => {
            if (unref(getCollapse)) return;

            if (isBoolean(data)) {
              state.opened = data;
              return;
            }

            if (isObject(data) && rootProps.accordion) {
              const { opend, parent, uidList } = data as Recordable;
              if (parent === instance?.parent) {
                state.opened = opend;
              } else if (!uidList.includes(instance?.uid)) {
                state.opened = false;
              }
              return;
            }

            if (props.name && Array.isArray(data)) {
              state.opened = (data as (string | number)[]).includes(props.name);
            }
          },
        );

        rootMenuEmitter.on('on-update-active-name:submenu', (data: number[]) => {
          if (instance?.uid) {
            state.active = data.includes(instance?.uid);
          }
        });
      });

      function handleVisibleChange(visible: boolean) {
        state.opened = visible;
      }

      // 继续注入将数据往嵌套菜单进行传递
      provide<SubMenuProvider>(`subMenu:${instance?.uid}`, {
        addSubMenu: parentAddSubmenu,
        removeSubMenu: parentRemoveSubmenu,
        getOpenNames: parentGetOpenNames,
        removeAll: parentRemoveAll,
        isRemoveAllPopup,
        sliceIndex,
        level: level + 1,
        handleMouseleave,
        props: rootProps,
      });

      return {
        getCollapse,
        prefixCls,
        getClass,
        getItemStyle,
        getSubClass,
        getOverlayStyle,
        getParentSubMenu,
        getTheme,
        getIsOpend,
        handleClick,
        getEvents,
        handleVisibleChange,
        ...toRefs(state),
      };
    },
  });
</script>
