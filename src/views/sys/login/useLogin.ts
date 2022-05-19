import type { Rule, RuleObject } from 'ant-design-vue/lib/form/interface';
import type { Ref } from 'vue';

import { computed, ref, unref } from 'vue';
import { useI18n } from 'vue-i18n';
// 登陆状态
export enum LoginStateEnum {
  LOGIN, //登录
  REGISTER, //注册
  RESET_PASSWORD, //重置密码
  MOBILE, // 手机
  QR_CODE, // 扫码
}

const currentState = ref(LoginStateEnum.LOGIN);

export function useLoginState() {
  // 重设登录状态
  function setLoginState(state: LoginStateEnum) {
    currentState.value = state;
  }

  // 当前登录状态
  const getLoginState = computed(() => currentState.value);

  // 返回登录
  function handleBackLogin() {
    setLoginState(LoginStateEnum.LOGIN);
  }

  return {
    setLoginState,
    getLoginState,
    handleBackLogin,
  };
}

/**
 * @description: 生成登录表单的规则
 */
export function useFormRules(formData?: Recordable) {
  const { t } = useI18n();

  const getAccountFormRule = computed(() => createRule(t('sys.login.accountPlaceholder')));
  const getPasswordFormRule = computed(() => createRule(t('sys.login.passwordPlaceholder')));
  const getSmsFormRule = computed(() => createRule(t('sys.login.smsPlaceholder')));
  const getMobileFormRule = computed(() => createRule(t('sys.login.mobilePlaceholder')));

  const validatePolicy = async (_: Rule, value: boolean) => {
    return !value ? Promise.reject(t('sys.login.policyPlaceholder')) : Promise.resolve();
  };

  const validateConfirmPassword = (password: string) => {
    return async (_: Rule, value: string) => {
      if (!value) {
        return Promise.reject(t('sys.login.passwordPlaceholder'));
      }
      if (value !== password) {
        return Promise.reject(t('sys.login.diffPwd'));
      }
      return Promise.resolve();
    };
  };

  const getFormRules = computed((): Record<string, Rule[]> => {
    const accountFormRule = unref(getAccountFormRule);
    const passwordFormRule = unref(getPasswordFormRule);
    const smsFormRule = unref(getSmsFormRule);
    const mobileFormRule = unref(getMobileFormRule);

    const mobileRule = {
      sms: smsFormRule,
      mobile: mobileFormRule,
    };

    switch (unref(currentState)) {
      // 注册表单规则
      case LoginStateEnum.REGISTER:
        return {
          account: accountFormRule,
          password: passwordFormRule,
          confirmPassword: [
            { validator: validateConfirmPassword(formData?.password), trigger: 'change' },
          ],
          policy: [{ validator: validatePolicy, trigger: 'change' }],
          ...mobileRule,
        } as Record<string, Rule[]>;
      // 重置密码表单规则
      case LoginStateEnum.RESET_PASSWORD:
        return {
          account: accountFormRule,
          ...mobileRule,
        } as Record<string, Rule[]>;
      // 手机登录表单规则
      case LoginStateEnum.MOBILE:
        return mobileRule as Record<string, Rule[]>;

      // 登录表单规则
      default:
        return {
          account: accountFormRule,
          password: passwordFormRule,
        } as Record<string, Rule[]>;
    }
  });

  return { getFormRules };
}

function createRule(message: string) {
  return [
    {
      required: true,
      message,
      trigger: 'change',
    },
  ];
}

/**
 * @description: 校验表单
 */
export function useFormValid<T extends Object = any>(formRef: Ref<any>) {
  async function validForm() {
    const form = unref(formRef);
    if (!form) return;
    const data = await form.validate();
    return data as T;
  }

  return { validForm };
}
