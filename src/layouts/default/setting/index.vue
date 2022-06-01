<template>
  <div @click="showSettingDrawer = true">
    <Icon icon="ion:settings-outline" />
    <SettingDrawer v-model:visible="showSettingDrawer" />
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, unref, computed } from 'vue';
  import Icon from '@/components/Icon';
  import SettingDrawer from './SettingDrawer';

  export default defineComponent({
    name: 'SettingButton',
    components: {
      Icon,
      SettingDrawer,
    },
    setup() {
      let showSettingDrawer = ref(false);

      return { showSettingDrawer };
    },
  });
</script>
