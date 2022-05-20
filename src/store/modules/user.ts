import { defineStore } from 'pinia';
import type { UserInfo } from '#/store';
import { RoleEnum } from '@/enums/roleEnum';

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
    async login() {},
  },
});

export function useUserStoreWithOut() {
  return useUserStore();
}
