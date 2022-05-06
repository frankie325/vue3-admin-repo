import type { Router } from "vue-router";

import { useUserStoreWithOut } from "@/store/modules/user";
import { PageEnum } from "@/enums/pageEnum";

const LOGIN_PATH = PageEnum.BASE_LOGIN;

const whitePathList: PageEnum[] = [LOGIN_PATH];

// 权限控制
export function createPermissionGuard(router: Router) {
    const userStore = useUserStoreWithOut();
    router.beforeEach((to, from, next) => {
        console.log(to, from);
        console.log(userStore);

        const token = userStore.getToken;

        if (whitePathList.includes(to.path as PageEnum)) {
            if (to.path === LOGIN_PATH && token) {
            }
            next();
            return;
        }

        if (!token) {
            // 如果token不存在，跳到登录页
            const redirectData: { path: string; replace: boolean; query?: Recordable<string> } = {
                path: LOGIN_PATH,
                replace: true,
            };

            if (to.path) {
                // 将原来本要跳转的地址保存在query参数中
                redirectData.query = {
                    ...redirectData.query,
                    redirect: to.path,
                };
            }

            next(redirectData);
            return;
        }
    });
}
