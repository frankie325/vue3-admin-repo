<template>
  <div>
    <a-switch v-model:checked="checked" @change="toggleDarkMode"></a-switch>
  </div>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import { useDesign } from '@/hooks/web/useDesign';

  import { updateDarkTheme } from '@/logics/theme/dark';

  const { prefixCls } = useDesign('dark-switch');

  const checked = ref(false);

  function toggleDarkMode(checked) {
    console.log(checked);
    if (checked) {
      updateDarkTheme('dark');
    } else {
      updateDarkTheme('light');
    }
  }
</script>
