import type { Router } from "vue-router";

import { createPermissionGuard } from "./permissionGuard";


// 注册路由导航守卫
export function setupRouterGuard(router: Router) {
    createPermissionGuard(router);
}
