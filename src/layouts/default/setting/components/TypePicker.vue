<template>
  <div :class="prefixCls"></div>
</template>

<script lang="ts">
  import { defineComponent, PropType } from 'vue';

  import { useDesign } from '@/hooks/web/useDesign';
  import { menuTypeList } from '../enum';

  export default defineComponent({
    name: 'MenuTypePicker',
    props: {
      menuTypeList: {
        type: Array as PropType<typeof menuTypeList>,
        default: () => [],
      },
    },
    setup() {
      const { prefixCls } = useDesign('setting-menu-type-picker');
      return {
        prefixCls,
      };
    },
  });
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-setting-menu-type-picker';

  .@{prefix-cls} {
    display: flex;
  }
</style>
