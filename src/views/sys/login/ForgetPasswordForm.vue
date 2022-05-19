<template>
  <template v-if="getShow">
    <LoginFormTitle class="enter-x" />
    <a-form class="p-4 enter-x" :model="formData" ref="formRef">
      <a-form-item name="account" class="enter-x">
        <a-input
          size="large"
          v-model:value="formData.account"
          :placeholder="t('sys.login.userName')"
          class="fix-auto-fill"
        />
      </a-form-item>
      <a-form-item name="mobile" class="enter-x">
        <a-input
          size="large"
          v-model:value="formData.mobile"
          :placeholder="t('sys.login.mobile')"
          class="fix-auto-fill"
        />
      </a-form-item>
      <a-form-item class="enter-x">
        <a-button type="primary" size="large" block @click="handleReset">
          {{ t('common.resetText') }}
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

  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.RESET_PASSWORD);

  const formRef = ref();

  const formData = reactive({
    account: '',
    mobile: '',
    sms: '',
  });

  async function handleReset() {
    const form = unref(formRef);
    if (!form) return;
    await form.resetFields();
  }
</script>
