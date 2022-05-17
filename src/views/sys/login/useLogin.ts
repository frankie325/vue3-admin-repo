import { computed, ref } from 'vue';

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

export function useFormRules() {}
