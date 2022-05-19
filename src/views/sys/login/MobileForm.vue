<template>
  <template v-if="getShow">
    <LoginFormTitle class="enter-x" />
    <a-form class="p-4 enter-x" :model="formData" ref="formRef">
      <a-form-item name="mobile" class="enter-x">
        <a-input
          size="large"
          v-model:value="formData.mobile"
          :placeholder="t('sys.login.mobile')"
          class="fix-auto-fill"
        />
      </a-form-item>
      <a-form-item class="enter-x">
        <a-button type="primary" size="large" block @click="handleLogin">
          {{ t('sys.login.loginButton') }}
        </a-button>
        <a-button size="large" block class="mt-4" @click="handleBackLogin">
          {{ t('sys.login.backSignIn') }}
        </a-button>
      </a-form-item>
    </a-form>
  </template>
</template>
<script setup lang="ts">
  import { ref, reactive, computed, unref } from 'vue';
  import { useI18n } from 'vue-i18n';

  import LoginFormTitle from './LoginFormTitle.vue';

  import { LoginStateEnum, useLoginState } from './useLogin';

  const { t } = useI18n();

  const { getLoginState, handleBackLogin } = useLoginState();

  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.MOBILE);

  const formRef = ref();

  const formData = reactive({
    mobile: '',
    sms: '',
  });

  async function handleLogin() {}
</script>
