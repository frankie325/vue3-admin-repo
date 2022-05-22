import { defineStore } from 'pinia';
import type { UserInfo } from '#/store';
import { RoleEnum } from '@/enums/roleEnum';
import { PageEnum } from '@/enums/pageEnum';
import { LoginParams } from '@/api/sys/userModel';
import { ErrorMessageMode } from '#/axios';
import { loginApi, getUserInfo } from '@/api/user';
import { store } from '@/store';
import { getAuthCache, setAuthCache } from '@/utils/auth';
import { ROLES_KEY, TOKEN_KEY, USER_INFO_KEY } from '@/enums/cacheEnum';
import { isArray } from '@/utils/is';
import { usePermissionStore } from '@/store/modules/permission';
import { router } from '@/router';

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
    // 上次用户信息更新时间
    lastUpdateTime: 0,
  }),
  getters: {
    // 获取token
    getToken(): string {
      return this.token || getAuthCache<string>(TOKEN_KEY);
    },
    // 获取用户角色信息
    getRoleList(): RoleEnum[] {
      return this.roleList.length > 0 ? this.roleList : getAuthCache<RoleEnum[]>(ROLES_KEY);
    },
  },
  actions: {
    /**
     * @description: 存储token
     */
    setToken(info: string | undefined) {
      this.token = info ? info : '';
      setAuthCache(TOKEN_KEY, this.token);
    },
    /**
     * @description: 存储用户所属角色信息
     */
    setRoleList(roleList: RoleEnum[]) {
      this.roleList = roleList;
      setAuthCache(ROLES_KEY, roleList);
    },
    /**
     * @description: 存储用户信息
     */
    setUserInfo(info: UserInfo | null) {
      this.userInfo = info;
      this.lastUpdateTime = new Date().getTime();
      setAuthCache(USER_INFO_KEY, info);
    },
    setSessionTimeout(flag: boolean) {
      this.sessionTimeout = flag;
    },

    /**
     * @description: 登录操作
     */
    async login(
      params: LoginParams & {
        goHome?: boolean;
        mode?: ErrorMessageMode;
      },
    ) {
      const { goHome = true, mode, ...loginParams } = params;

      try {
        const data = await loginApi(loginParams, mode);
        const { token } = data;
        // 存储token
        this.setToken(token);
        return this.afterLoginAction(goHome);
      } catch (error) {
        return Promise.reject(error);
      }
    },

    /**
     * @description: 登录后操作
     */
    async afterLoginAction(goHome?: boolean) {
      if (!this.getToken) return null;

      // 用户信息操作
      const userInfo = await this.getUserInfoAction();

      const sessionTimeout = this.sessionTimeout;

      if (sessionTimeout) {
        // 如果登录过期，重置状态
        this.setSessionTimeout(false);
      } else {
        const permissionStore = usePermissionStore();
        if (!permissionStore.isDynamicAddedRoute) {
          const routes = await permissionStore.buildRoutesAction();
        }

        // 跳转到主页
        goHome && (await router.replace(userInfo?.homePath || PageEnum.BASE_HOME));
      }
      return userInfo;
    },
    /**
     * @description: 用户信息操作
     */
    async getUserInfoAction(): Promise<UserInfo | null> {
      if (!this.getToken) return null;

      const userInfo = await getUserInfo();

      const { roles = [] } = userInfo;
      // 存储用户所属角色信息
      if (isArray(roles)) {
        const roleList = roles.map((item) => item.value) as RoleEnum[];
        this.setRoleList(roleList);
      } else {
        userInfo.roles = [];
        this.setRoleList([]);
      }
      // 存储用户信息
      this.setUserInfo(userInfo);
      return userInfo;
    },
    async logout(goLogin = false) {},
  },
});

export function useUserStoreWithOut() {
  return useUserStore(store);
}
