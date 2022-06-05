import { defineStore } from 'pinia';
import { RouteRecordRaw } from 'vue-router';
import { h } from 'vue';
import type { UserInfo } from '#/store';
import { RoleEnum } from '@/enums/roleEnum';
import { PageEnum } from '@/enums/pageEnum';
import { LoginParams } from '@/api/sys/userModel';
import { ErrorMessageMode } from '#/axios';
import { loginApi, getUserInfo, doLogout } from '@/api/user';
import { store } from '@/store';
import { getAuthCache, setAuthCache } from '@/utils/auth';
import { ROLES_KEY, TOKEN_KEY, USER_INFO_KEY } from '@/enums/cacheEnum';
import { PAGE_NOT_FOUND_ROUTE } from '@/router/routes/basic';
import { isArray } from '@/utils/is';
import { usePermissionStore } from '@/store/modules/permission';
import { router } from '@/router';
import { useMessage } from '@/hooks/web/useMessage';
import { useI18n } from '@/hooks/web/useI18n';

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
    getToken(): string {
      return this.token || getAuthCache<string>(TOKEN_KEY);
    },
    getRoleList(): RoleEnum[] {
      return this.roleList.length > 0 ? this.roleList : getAuthCache<RoleEnum[]>(ROLES_KEY);
    },
    getUserInfo(): UserInfo {
      return this.userInfo || getAuthCache<UserInfo>(USER_INFO_KEY) || {};
    },
    getSessionTimeout(): boolean {
      return !!this.sessionTimeout;
    },
    getLastUpdateTime(): number {
      return this.lastUpdateTime;
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
    /**
     * @description: 设置登录过期
     */
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
          routes.forEach((route) => {
            router.addRoute(route as unknown as RouteRecordRaw);
          });
          router.addRoute(PAGE_NOT_FOUND_ROUTE as unknown as RouteRecordRaw);
          permissionStore.setDynamicAddedRoute(true);
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
    /**
     * @description: 退出登录
     */
    async logout(goLogin = false) {
      if (this.getToken) {
        try {
          await doLogout();
        } catch {
          console.log('注销Token失败');
        }
      }

      // 清空token
      this.setToken(undefined);
      this.setSessionTimeout(false);
      this.setUserInfo(null);
      goLogin && router.push(PageEnum.BASE_LOGIN);
    },
    confirmLoginOut() {
      const { createConfirm } = useMessage();
      const { t } = useI18n();

      createConfirm({
        iconType: 'warning',
        title: () => h('span', t('sys.app.logoutTip')),
        content: () => h('span', t('sys.app.logoutMessage')),
        onOk: async () => {
          await this.logout(true);
        },
      });
    },
    resetState() {
      this.userInfo = null;
      this.token = '';
      this.roleList = [];
      this.sessionTimeout = false;
    },
  },
});

export function useUserStoreWithOut() {
  return useUserStore(store);
}
