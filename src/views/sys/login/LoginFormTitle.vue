<template>
  <h2 class="mb-3 text-2xl font-bold text-center xl:text-3xl">
    {{ getFormTitle }}
  </h2>
</template>

<script setup lang="ts">
  import { computed, unref } from 'vue';
  import { useI18n } from '@/hooks/web/useI18n';

  import { useLoginState, LoginStateEnum } from './useLogin';

  const { t } = useI18n();

  const { getLoginState } = useLoginState();

  const getFormTitle = computed(() => {
    const titleObj = {
      [LoginStateEnum.LOGIN]: t('sys.login.signInFormTitle'),
      [LoginStateEnum.REGISTER]: t('sys.login.signUpFormTitle'),
      [LoginStateEnum.RESET_PASSWORD]: t('sys.login.forgetFormTitle'),
      [LoginStateEnum.MOBILE]: t('sys.login.mobileSignInFormTitle'),
      [LoginStateEnum.QR_CODE]: t('sys.login.qrSignInFormTitle'),
    };
    return titleObj[unref(getLoginState)];
  });
</script>
