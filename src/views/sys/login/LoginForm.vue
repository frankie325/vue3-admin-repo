<template>
  <LoginFormTitle class="enter-x" v-show="getShow" />
  <a-form
    ref="formRef"
    class="p-4 enter-x"
    :model="formData"
    :rules="getFormRules"
    v-show="getShow"
    @keypress.enter="handleLogin"
  >
    <a-form-item name="account" class="enter-x">
      <a-input
        size="large"
        v-model:value="formData.account"
        :placeholder="t('sys.login.userName')"
        class="fix-auto-fill"
      />
    </a-form-item>
    <a-form-item name="password" class="enter-x">
      <a-input-password
        size="large"
        v-model:value="formData.password"
        :placeholder="t('sys.login.password')"
        class="fix-auto-fill"
      />
    </a-form-item>

    <a-row class="enter-x">
      <a-col :span="12">
        <a-form-item>
          <!-- 没有逻辑，根据项目自己处理 -->
          <a-checkbox v-model:checked="rememberMe">{{ t('sys.login.rememberMe') }}</a-checkbox>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item class="text-right">
          <!-- 没有逻辑，根据项目自己处理 -->
          <a-button type="link" size="small" @click="setLoginState(LoginStateEnum.RESET_PASSWORD)">
            {{ t('sys.login.forgetPassword') }}
          </a-button>
        </a-form-item>
      </a-col>
    </a-row>

    <a-form-item class="enter-x">
      <a-button type="primary" block size="large" @click="handleLogin">{{
        t('sys.login.loginButton')
      }}</a-button>
    </a-form-item>
    <a-row class="enter-x" :gutter="6">
      <a-col :md="8" :xs="24">
        <a-button block @click="setLoginState(LoginStateEnum.MOBILE)">{{
          t('sys.login.mobileSignInFormTitle')
        }}</a-button>
      </a-col>
      <a-col :md="8" :xs="24" class="my-2 xs:my-2 md:my-0">
        <a-button block @click="setLoginState(LoginStateEnum.QR_CODE)">{{
          t('sys.login.qrSignInFormTitle')
        }}</a-button>
      </a-col>
      <a-col :md="8" :xs="24">
        <a-button block @click="setLoginState(LoginStateEnum.REGISTER)">{{
          t('sys.login.signUpFormTitle')
        }}</a-button>
      </a-col>
    </a-row>

    <a-divider :plain="true" class="enter-x">其他登录方式</a-divider>

    <div class="flex justify-evenly enter-x" :class="`${prefixCls}-sign-in-way`">
      <GithubFilled />
      <WechatFilled />
      <AlipayCircleFilled />
      <GoogleCircleFilled />
      <TwitterCircleFilled />
    </div>
  </a-form>
</template>

<script setup lang="ts">
  import { ref, reactive, computed, unref } from 'vue';
  import { useI18n } from '@/hooks/web/useI18n';

  import {
    GithubFilled,
    WechatFilled,
    AlipayCircleFilled,
    GoogleCircleFilled,
    TwitterCircleFilled,
  } from '@ant-design/icons-vue';

  import LoginFormTitle from './LoginFormTitle.vue';
  import { LoginStateEnum, useLoginState, useFormRules, useFormValid } from './useLogin';
  import { useDesign } from '@/hooks/web/useDesign';
  import { useUserStore } from '@/store/modules/user';

  const { t } = useI18n();

  const { setLoginState, getLoginState } = useLoginState();

  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.LOGIN);

  const rememberMe = ref(false);

  const { prefixCls } = useDesign('login');

  const formRef = ref();
  const loading = ref(false);

  const formData = reactive({
    account: 'admin',
    password: '123456',
  });

  const { getFormRules } = useFormRules();
  const { validForm } = useFormValid(formRef);

  const userStore = useUserStore();

  async function handleLogin() {
    const data = await validForm();
    if (!data) return;

    try {
      loading.value = true;
      const userInfo = await userStore.login({
        password: data.password,
        username: data.account,
        mode: 'none', //不要默认的错误提示
      });
    } catch (error) {}
  }
</script>
