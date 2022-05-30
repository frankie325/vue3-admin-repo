<template>
  <BasicMenuItem v-if="!menuHasChildren(item) && getShowMenu" v-bind="$props" />
  <a-sub-menu v-if="menuHasChildren(item) && getShowMenu">
    <template #title>
      <MenuItemContent v-bind="$props" :item="item" />
    </template>

    <template v-for="childrenItem in item.children || []" :key="childrenItem.path">
      <BasicSubMenuItem v-bind="$props" :item="childrenItem" />
    </template>
  </a-sub-menu>
</template>

<script lang="ts">
  import type { Menu as MenuType } from '@/router/types';
  import { defineComponent, computed } from 'vue';

  import BasicMenuItem from './BasicMenuItem.vue';
  import MenuItemContent from './MenuItemContent.vue';

  import { itemProps } from '../props';
  import { useDesign } from '@/hooks/web/useDesign';

  export default defineComponent({
    name: 'BasicSubMenuItem',
    components: {
      BasicMenuItem,
      MenuItemContent,
    },
    props: itemProps,
    setup(props) {
      const { prefixCls } = useDesign('basic-menu-item');

      // 是否展示菜单
      const getShowMenu = computed(() => !props.item.meta?.hideMenu);

      function menuHasChildren(menuTreeItem: MenuType): boolean {
        return (
          !menuTreeItem.meta?.hideChildrenInMenu &&
          Reflect.has(menuTreeItem, 'children') &&
          !!menuTreeItem.children &&
          menuTreeItem.children.length > 0
        );
      }

      return {
        prefixCls,
        menuHasChildren,
        getShowMenu,
      };
    },
  });
</script>
