<template>
  <li :class="getClass" :style="getCollapse ? {} : getItemStyle" @click.stop="handleClickItem">
    <a-tooltip placement="right" v-if="showTooptip">
      <template #title>
        <slot name="title"></slot>
      </template>
    </a-tooltip>
    <template v-else>
      <slot></slot>
      <slot name="title"></slot>
    </template>
  </li>
</template>

<script lang="ts">
  import { PropType } from 'vue';
  import { defineComponent, ref, computed, unref, getCurrentInstance, watch } from 'vue';

  import { propTypes } from '@/utils/propTypes';
  import { useDesign } from '@/hooks/web/useDesign';
  import { useMenuItem } from './useMenu';
  import { useSimpleRootMenuContext } from './useSimpleMenuContext';

  export default defineComponent({
    name: 'MenuItem',
    props: {
      name: {
        type: [String, Number] as PropType<string | number>,
        required: true,
      },
      disabled: propTypes.bool,
    },
    setup(props, { slots }) {
      const instance = getCurrentInstance();

      const { getItemStyle, getParentList, getParentMenu, getParentRootMenu } =
        useMenuItem(instance);
      const { prefixCls } = useDesign('menu');
      const { rootMenuEmitter, activeName } = useSimpleRootMenuContext();

      // 菜单是否选中激活
      const active = ref(false);

      // 激活菜单变化时
      watch(
        () => activeName.value,
        (name) => {
          if (name === props.name) {
            const { list, uidList } = getParentList();
            active.value = true;
            // 将父级SubMenu的active设置为true
            list.forEach((item) => {
              if (item.proxy) {
                (item.proxy as any).active = true;
              }
            });

            rootMenuEmitter.emit('on-update-active-name:submenu', uidList);
          } else {
            active.value = false;
          }
        },
        { immediate: true },
      );

      // MenuItem类名
      const getClass = computed(() => {
        return [
          `${prefixCls}-item`,
          {
            [`${prefixCls}-item-active`]: unref(active), //菜单激活时样式
            [`${prefixCls}-item-selected`]: unref(active), //菜单激活时样式
            [`${prefixCls}-item-disabled`]: !!props.disabled,
          },
        ];
      });

      // 获取父级实例的collapse属性，是否需要折叠菜单
      const getCollapse = computed(() => unref(getParentRootMenu)?.props.collapse);

      // 是否显示Tooptip
      const showTooptip = computed(() => {
        return unref(getParentMenu)?.type.name === 'Menu' && unref(getCollapse) && slots.title;
      });

      function handleClickItem() {
        const { disabled } = props;
        if (disabled) {
          return;
        }

        // 触发选中菜单事件
        rootMenuEmitter.emit('on-menu-item-select', props.name);

        if (unref(getCollapse)) {
          return;
        }
        // 获取所有父级SubMenu的实例uid;
        const { uidList } = getParentList();

        rootMenuEmitter.emit('on-update-opened', {
          opend: false,
          parent: instance?.parent,
          uidList: uidList,
        });
      }

      return {
        getClass,
        showTooptip,
        getCollapse,
        getItemStyle,
        handleClickItem,
      };
    },
  });
</script>
