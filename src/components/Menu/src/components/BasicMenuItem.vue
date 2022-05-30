<template>
  <a-menu-item :key="item.path">
    <MenuItemContent v-bind="$props" :item="item" />
  </a-menu-item>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { itemProps } from '../props';

  import MenuItemContent from './MenuItemContent.vue';
  export default defineComponent({
    name: 'BasicMenuItem',
    components: { MenuItemContent },
    props: itemProps,
    setup() {
      return {};
    },
  });
</script>
