<template>
  <!-- <StudyVue3 /> -->
  <a-config-provider :locale="getAntdLocale">
    <AppProvider>
      <router-view />
    </AppProvider>
  </a-config-provider>
</template>

<script setup lang="ts">
  import StudyVue3 from './study/index.vue';
  import { AppProvider } from '@/components/Application';
  import { useLocale } from '@/locales/useLocale';
  import axios from 'axios';
  import qs from 'qs';

  const { getAntdLocale } = useLocale();

  axios({
    method: 'post',
    url: '/basic-api/login',
  });
</script>
