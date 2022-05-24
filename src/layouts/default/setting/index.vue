<template>
  <div @click="showSettingDrawer = true">
    <SettingOutlined />
    <SettingDrawer v-model:visible="showSettingDrawer" />
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, unref, computed } from 'vue';
  import { SettingOutlined } from '@ant-design/icons-vue';

  import SettingDrawer from './SettingDrawer';

  export default defineComponent({
    name: 'SettingButton',
    components: {
      SettingOutlined,
      SettingDrawer,
    },
    setup() {
      let showSettingDrawer = ref(false);

      return { showSettingDrawer };
    },
  });
</script>
