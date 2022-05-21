<template>
  <template v-if="getShow">
    <LoginFormTitle class="enter-x" />
    <div> </div>
    <a-divider class="enter-x" plain>{{ t('sys.login.scanSign') }}</a-divider>
    <a-button size="large" block class="mt-4 enter-x" @click="handleBackLogin">
      {{ t('sys.login.backSignIn') }}
    </a-button>
  </template>
</template>
<script setup lang="ts">
  import { computed, unref } from 'vue';
  import { useI18n } from '@/hooks/web/useI18n';

  import LoginFormTitle from './LoginFormTitle.vue';

  import { LoginStateEnum, useLoginState } from './useLogin';

  const { t } = useI18n();

  const { getLoginState, handleBackLogin } = useLoginState();

  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.QR_CODE);
</script>
