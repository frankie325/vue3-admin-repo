<template>
  <template v-if="getShow">
    <LoginFormTitle class="enter-x" />
    <a-form class="p-4 enter-x" :model="formData" ref="formRef">
      <a-form-item name="account" class="enter-x">
        <a-input
          size="large"
          v-model:value="formData.account"
          :placeholder="t('sys.login.userName')"
        />
      </a-form-item>
      <a-form-item name="mobile" class="enter-x">
        <a-input
          size="large"
          v-model:value="formData.mobile"
          :placeholder="t('sys.login.mobile')"
        />
      </a-form-item>
      <a-form-item name="password" class="enter-x">
        <a-input-password
          size="large"
          v-model:value="formData.password"
          :placeholder="t('sys.login.password')"
        />
      </a-form-item>
      <a-form-item name="confirmPassword" class="enter-x">
        <a-input-password
          size="large"
          v-model:value="formData.confirmPassword"
          :placeholder="t('sys.login.confirmPassword')"
        />
      </a-form-item>
      <a-form-item name="policy" class="enter-x">
        <a-checkbox v-model:checked="formData.policy">{{ t('sys.login.policy') }}</a-checkbox>
      </a-form-item>
      <a-button type="primary" size="large" class="enter-x" block @click="handleRegister">
        {{ t('sys.login.registerButton') }}
      </a-button>
      <a-button size="large" block class="mt-4 enter-x" @click="handleBackLogin">
        {{ t('sys.login.backSignIn') }}
      </a-button>
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

  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.REGISTER);

  const formRef = ref();

  const formData = reactive({
    account: '',
    password: '',
    confirmPassword: '',
    mobile: '',
    sms: '',
    policy: false,
  });

  async function handleRegister() {}
</script>
