<template>
  <span> <MenuUnfoldOutlined /> <MenuFoldOutlined /> </span>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons-vue';

  export default defineComponent({
    name: 'HeaderTrigger',
    components: { MenuUnfoldOutlined, MenuFoldOutlined },
  });
</script>
