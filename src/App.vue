<template>
  <!-- <StudyVue3 /> -->
  <AConfigProvider :get-popup-container="getPopupContainer">
    <RouterView />
  </AConfigProvider>
</template>

<script setup lang="ts">
  import StudyVue3 from './study/index.vue';
  import { useLocale } from '@/locales/useLocale';
  useLocale();
  function getPopupContainer(el, dialogContext) {
    if (dialogContext) {
      return dialogContext.getDialogWrap();
    }
    return document.body;
  }
</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;

    width: 100%;
    color: #10;
  }
</style>
