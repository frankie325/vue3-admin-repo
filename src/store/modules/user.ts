import { defineStore } from 'pinia';
import type { UserInfo } from '#/store';
import { RoleEnum } from '@/enums/roleEnum';
import { LoginParams } from '@/api/sys/userModel';
import { ErrorMessageMode } from '#/axios';
import { loginApi } from '@/api/user';
import { store } from '@/store';
interface UserState {
  userInfo: Nullable<UserInfo>;
  token?: string;
  roleList: RoleEnum[];
  sessionTimeout?: boolean;
  lastUpdateTime: number;
}

// 定义登录用户信息仓库
export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    userInfo: null,
    token: undefined,
    roleList: [],
    // 是否登录过期
    sessionTimeout: false,
    lastUpdateTime: 0,
  }),
  getters: {
    getToken(): string {
      return this.token || '';
    },
  },
  actions: {
    setToken(info: string | undefined) {},
    setSessionTimeout(flag: boolean) {},
    async login(
      params: LoginParams & {
        goHome?: boolean;
        mode?: ErrorMessageMode;
      },
    ) {
      const { goHome = true, mode, ...loginParams } = params;
      const data = await loginApi(loginParams, mode);
    },
    async logout(goLogin = false) {},
  },
});

export function useUserStoreWithOut() {
  return useUserStore(store);
}
