<template>
  <h2 class="">
    {{ getFormTitle }}
  </h2>
</template>

<script setup lang="ts">
  import { computed, unref } from 'vue';
  import { useI18n } from 'vue-i18n';
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
