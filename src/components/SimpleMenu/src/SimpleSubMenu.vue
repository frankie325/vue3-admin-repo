<template>
  <!-- 没有子菜单 -->
  <MenuItem
    :name="item.path"
    v-if="!menuHasChildren(item) && getShowMenu"
    v-bind="$props"
    :class="getLevelClass"
  >
    <Icon v-if="getIcon" :icon="getIcon" :size="16" />
    <!-- 折叠时显示的文字 -->
    <div v-if="collapsedShowTitle && getIsCollapseParent" class="mt-1 collapse-title">
      {{ getI18nName }}
    </div>
    <template #title>
      <span :class="['ml-2', `${prefixCls}-sub-title`]">{{ getI18nName }}</span>
      <SimpleMenuTag :item="item" :collapseParent="getIsCollapseParent" />
    </template>
  </MenuItem>
  <!-- 有嵌套子菜单 -->
  <SubMenu
    :name="item.path"
    v-if="menuHasChildren(item) && getShowMenu"
    :class="[getLevelClass, theme]"
    :collapsedShowTitle="collapsedShowTitle"
  >
    <template #title>
      <Icon v-if="getIcon" :icon="getIcon" :size="16" />
      <!-- 折叠时显示的文字 -->
      <div v-if="collapsedShowTitle && getIsCollapseParent" class="mt-2 collapse-title">
        {{ getI18nName }}
      </div>
      <span v-show="getShowSubTitle" :class="['ml-2', `${prefixCls}-sub-title`]">{{
        getI18nName
      }}</span>
      <SimpleMenuTag :item="item" :collapseParent="getIsCollapseParent" />
    </template>
    <template v-for="childrenItem in item.children || []" :key="childrenItem.path">
      <SimpleSubMenu v-bind="$props" :item="childrenItem" :parent="false" />
    </template>
  </SubMenu>
</template>

<script lang="ts">
  import type { PropType } from 'vue';
  import type { Menu } from '@/router/types';

  import { defineComponent, computed } from 'vue';
  import MenuItem from './components/MenuItem.vue';
  import SimpleMenuTag from './SimpleMenuTag.vue';
  import SubMenu from './components/SubMenuItem.vue';
  import Icon from '@/components/Icon/index';

  import { propTypes } from '@/utils/propTypes';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useDesign } from '@/hooks/web/useDesign';

  export default defineComponent({
    name: 'SimpleSubMenu',
    components: {
      MenuItem,
      SubMenu,
      SimpleMenuTag,
      Icon,
    },
    props: {
      // 菜单
      item: {
        type: Object as PropType<Menu>,
        default: () => ({}),
      },
      // 是否为顶层SimpleSubMenu
      parent: propTypes.bool,
      // 折叠时是否显示标题
      collapsedShowTitle: propTypes.bool,
      collapse: propTypes.bool,
      theme: propTypes.oneOf(['dark', 'light']),
    },
    setup(props) {
      const { t } = useI18n();

      const { prefixCls } = useDesign('simple-menu');
      const getI18nName = computed(() => t(props.item?.name));

      // 是否显示菜单
      const getShowMenu = computed(() => !props.item?.meta?.hideMenu);
      const getIcon = computed(() => props.item?.icon);
      const getShowSubTitle = computed(() => !props.collapse || !props.parent);
      const getLevelClass = computed(() => {
        return [
          {
            [`${prefixCls}__parent`]: props.parent,
            [`${prefixCls}__children`]: !props.parent,
          },
        ];
      });
      // 是否需要折叠且为顶层SimpleSubMenu
      const getIsCollapseParent = computed(() => !!props.collapse && !!props.parent);

      // 是否生成子菜单
      function menuHasChildren(menuTreeItem: Menu): boolean {
        return (
          !menuTreeItem.meta?.hideChildrenInMenu && //meta.hideChildrenInMenu为true，则不生成子菜单
          Reflect.has(menuTreeItem, 'children') &&
          !!menuTreeItem.children &&
          menuTreeItem.children.length > 0
        );
      }

      return {
        prefixCls,
        getI18nName,
        getIcon,
        getIsCollapseParent,
        getShowMenu,
        getShowSubTitle,
        getLevelClass,
        menuHasChildren,
      };
    },
  });
</script>
