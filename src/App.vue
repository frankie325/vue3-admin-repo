<template>
  <a-config-provider :locale="getAntdLocale">
    <AppProvider>
      <router-view />
    </AppProvider>
  </a-config-provider>
</template>

<script setup lang="ts">
  import { AppProvider } from '@/components/Application';
  import { useLocale } from '@/locales/useLocale';
  const { getAntdLocale } = useLocale();
</script>
