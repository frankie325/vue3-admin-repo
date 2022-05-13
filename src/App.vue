<template>
  <!-- <StudyVue3 /> -->
  <AConfigProvider :get-popup-container="getPopupContainer">
    <AppProvider>
      <RouterView />
    </AppProvider>
  </AConfigProvider>
</template>

<script setup lang="ts">
  import StudyVue3 from './study/index.vue';
  import { AppProvider } from '@/components/Application';
  import { useLocale } from '@/locales/useLocale';
  useLocale();
  function getPopupContainer(el, dialogContext) {
    if (dialogContext) {
      return dialogContext.getDialogWrap();
    }
    return document.body;
  }
</script>
