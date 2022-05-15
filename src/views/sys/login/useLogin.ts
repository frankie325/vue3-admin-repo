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
  const getLoginState = computed(() => currentState.value);
  return {
    getLoginState,
  };
}
