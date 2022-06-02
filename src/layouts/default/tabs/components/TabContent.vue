<template>
  <a-dropdown placement="bottom" overlayClassName="multiple-tabs__dropdown" :trigger="getTrigger">
    <div :class="`${prefixCls}__info`" @contextmenu="handleContext" v-if="getIsTabs">
      <span class="ml-1">{{ getTitle }}</span>
    </div>
    <span :class="`${prefixCls}__extra-quick`" v-else @click="handleContext">
      <Icon icon="ion:chevron-down" />
    </span>
    <template #overlay>
      <a-menu>
        <template v-for="item in getDropMenuList" :key="`${item.event}`">
          <a-menu-item :disabled="item.disabled" @click="handleMenuEvent(item)">
            <div>
              <Icon :icon="item.icon" v-if="item.icon" />
              <span class="ml-1">{{ item.text }}</span>
            </div>
            <a-menu-divider v-if="item.divider" />
          </a-menu-item>
        </template>
      </a-menu>
    </template>
  </a-dropdown>
</template>
<script lang="ts">
  import type { PropType } from 'vue';
  import type { RouteLocationNormalized } from 'vue-router';
  import { Icon } from '@/components/Icon';

  import { TabContentProps } from '../types';
  import { defineComponent, computed, unref } from 'vue';
  import { useDesign } from '@/hooks/web/useDesign';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useTabDropdown } from '../useTabDropdown';

  export default defineComponent({
    name: 'TabContent',
    components: {
      Icon,
    },
    props: {
      tabItem: {
        type: Object as PropType<RouteLocationNormalized>,
        default: null,
      },
      isExtra: Boolean,
    },
    setup(props) {
      const { prefixCls } = useDesign('multiple-tabs-content');
      const { t } = useI18n();

      // 标签内容文字
      const getTitle = computed(() => {
        const { tabItem: { meta } = {} } = props;
        return meta && t(meta.title as string);
      });

      const getIsTabs = computed(() => !props.isExtra);

      // 作为标签内容时触发方式为右键点击
      const getTrigger = computed((): ('contextmenu' | 'click' | 'hover')[] =>
        unref(getIsTabs) ? ['contextmenu'] : ['click'],
      );

      const { getDropMenuList, handleContextMenu, handleMenuEvent } = useTabDropdown(
        props as TabContentProps,
        getIsTabs,
      );

      // 设置当前右键选中的标签页
      function handleContext(e: Event) {
        props.tabItem && handleContextMenu(props.tabItem)(e);
      }

      return {
        prefixCls,
        getTitle,
        getTrigger,
        getIsTabs,
        getDropMenuList,
        handleContext,
        handleMenuEvent,
      };
    },
  });
</script>
