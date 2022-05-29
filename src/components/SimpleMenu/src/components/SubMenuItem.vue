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
    >
      <div :class="getSubClass">
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
        <div>
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

      // 获取从Menu或者SubMenu注入的数据
      const {
        addSubMenu: parentAddSubmenu,
        removeSubMenu: parentRemoveSubmenu,
        removeAll: parentRemoveAll,
        getOpenNames: parentGetOpenNames,
        isRemoveAllPopup,
        sliceIndex,
        level,
        props: rootProps,
        // handleMouseleave: parentHandleMouseleave,
      } = inject<SubMenuProvider>(`subMenu:${getParentMenu.value?.uid}`)!;

      const state = reactive({
        active: false,
        opened: false,
      });

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
      // 是否折叠菜单
      const getCollapse = computed(() => rootProps.collapse);
      const getTheme = computed(() => rootProps.theme);
      const getAccordion = computed(() => rootProps.accordion);

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

      onBeforeMount(() => {
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
      });

      function handleMouseleave() {}

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
        handleClick,
        ...toRefs(state),
      };
    },
  });
</script>
