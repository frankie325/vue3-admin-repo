import { MockMethod } from 'vite-plugin-mock';
import { resultError, resultSuccess, getRequestToken, requestParams } from '../_util';
import { createFakeUserList } from './user';

const dashboardRoute = {
  path: '/dashboard',
  name: 'Dashboard',
  component: 'LAYOUT',
  redirect: '/dashboard/analysis',
  meta: {
    title: 'routes.dashboard.dashboard',
    // hideChildrenInMenu: true,
    icon: 'bx:bx-home',
  },
  children: [
    {
      path: 'analysis',
      name: 'Analysis',
      component: '/dashboard/analysis/index',
      meta: {
        // hideMenu: true,
        // hideBreadcrumb: true,
        title: 'routes.dashboard.analysis',
        // currentActiveMenu: '/dashboard',
        icon: 'carbon:text-link-analysis',
      },
    },
    {
      path: 'workbench',
      name: 'Workbench',
      component: '/dashboard/workbench/index',
      meta: {
        // hideMenu: true,
        // hideBreadcrumb: true,
        title: 'routes.dashboard.workbench',
        // currentActiveMenu: '/dashboard',
        icon: 'icon-park-solid:workbench',
      },
    },
  ],
};

const permissionRoute = {
  path: '/permission',
  name: 'PermissionBackDemo',
  component: 'LAYOUT',
  meta: {
    title: 'routes.demo.permission.dynamicPermission',
    icon: 'carbon:user-role',
  },
  children: [
    {
      path: 'setting',
      name: 'BackAuthPage',
      component: '/demo/permission/index',
      meta: {
        title: 'routes.demo.permission.backPage',
      },
    },
    {
      path: 'btn',
      name: 'BtnAuthPage',
      component: '/demo/permission/Btn',
      meta: {
        title: 'routes.demo.permission.backBtn',
      },
    },
  ],
};

// const authRoute = {
//   path: '/permission',
//   name: 'Permission',
//   component: 'LAYOUT',
//   redirect: '/permission/front/page',
//   meta: {
//     icon: 'carbon:user-role',
//     title: 'routes.demo.permission.permission',
//   },
//   children: [backRoute],
// };

const levelRoute = {
  path: '/level',
  name: 'Level',
  component: 'LAYOUT',
  redirect: '/level/menu1/menu1-1',
  meta: {
    icon: 'bx:menu-alt-right',
    title: 'routes.demo.level.level',
  },

  children: [
    {
      path: 'menu1',
      name: 'Menu1Demo',
      meta: {
        title: 'Menu1',
      },
      children: [
        {
          path: 'menu1-1',
          name: 'Menu11Demo',
          meta: {
            title: 'Menu1-1',
          },
          children: [
            {
              path: 'menu1-1-1',
              name: 'Menu111Demo',
              component: '/demo/level/Menu111',
              meta: {
                title: 'Menu111',
              },
            },
          ],
        },
        {
          path: 'menu1-2',
          name: 'Menu12Demo',
          component: '/demo/level/Menu12',
          meta: {
            title: 'Menu1-2',
          },
        },
      ],
    },
    {
      path: 'menu2',
      name: 'Menu2Demo',
      component: '/demo/level/Menu2',
      meta: {
        title: 'Menu2',
      },
    },
  ],
};

const sysRoute = {
  path: '/system',
  name: 'System',
  component: 'LAYOUT',
  redirect: '/system/account',
  meta: {
    icon: 'ion:settings-outline',
    title: 'routes.demo.system.moduleName',
  },
  children: [
    {
      path: 'account',
      name: 'AccountManagement',
      meta: {
        title: 'routes.demo.system.account',
        ignoreKeepAlive: true,
      },
      component: '/demo/system/account/index',
    },
    // {
    //   path: 'account_detail/:id',
    //   name: 'AccountDetail',
    //   meta: {
    //     hideMenu: true,
    //     title: 'routes.demo.system.account_detail',
    //     ignoreKeepAlive: true,
    //     showMenu: false,
    //     currentActiveMenu: '/system/account',
    //   },
    //   component: '/demo/system/account/AccountDetail',
    // },
    {
      path: 'role',
      name: 'RoleManagement',
      meta: {
        title: 'routes.demo.system.role',
        ignoreKeepAlive: true,
      },
      component: '/demo/system/role/index',
    },
    // {
    //   path: 'menu',
    //   name: 'MenuManagement',
    //   meta: {
    //     title: 'routes.demo.system.menu',
    //     ignoreKeepAlive: true,
    //   },
    //   component: '/demo/system/menu/index',
    // },
    // {
    //   path: 'dept',
    //   name: 'DeptManagement',
    //   meta: {
    //     title: 'routes.demo.system.dept',
    //     ignoreKeepAlive: true,
    //   },
    //   component: '/demo/system/dept/index',
    // },
    // {
    //   path: 'changePassword',
    //   name: 'ChangePassword',
    //   meta: {
    //     title: 'routes.demo.system.password',
    //     ignoreKeepAlive: true,
    //   },
    //   component: '/demo/system/password/index',
    // },
  ],
};

const aboutRoute = {
  path: '/about',
  name: 'About',
  component: 'LAYOUT',
  redirect: '/about/index',
  meta: {
    hideChildrenInMenu: true,
    icon: 'simple-icons:about-dot-me',
    title: 'routes.dashboard.about',
    orderNo: 100000,
  },
  children: [
    {
      path: 'index',
      name: 'AboutPage',
      component: 'sys/about/index.vue',
      meta: {
        title: 'routes.dashboard.about',
        icon: 'simple-icons:about-dot-me',
        hideMenu: true,
      },
    },
  ],
};

const linkRoute = {
  path: '/link',
  name: 'Link',
  component: 'LAYOUT',
  meta: {
    icon: 'ion:tv-outline',
    title: 'routes.demo.iframe.frame',
  },
  children: [
    {
      path: 'bilibili',
      name: 'Bilibili',
      meta: {
        title: '哔哩哔哩(内嵌)',
        frameSrc: 'https://www.bilibili.com/',
      },
    },
    {
      path: 'https://www.baidu.com/',
      name: 'Baidu',
      meta: {
        title: '百度(外链)',
      },
    },
  ],
};
// 模拟后台根据权限返回不同的菜单，这里没有根据权限列表做过滤，只是返回不同的菜单
// 实际项目要根据权限列表对菜单进行过滤
export default [
  {
    url: '/basic-api/getMenuList',
    timeout: 1000,
    method: 'get',
    response: (request: requestParams) => {
      const token = getRequestToken(request);
      if (!token) {
        return resultError('Invalid token!');
      }
      const checkUser = createFakeUserList().find((item) => item.token === token);
      if (!checkUser) {
        return resultError('Invalid user token!');
      }
      const id = checkUser.userId;
      let menu: Object[];
      switch (id) {
        case '1':
          dashboardRoute.redirect = dashboardRoute.path + '/' + dashboardRoute.children[0].path;
          menu = [dashboardRoute, permissionRoute, levelRoute, sysRoute, linkRoute, aboutRoute];
          break;
        case '2':
          dashboardRoute.redirect = dashboardRoute.path + '/' + dashboardRoute.children[1].path;
          menu = [dashboardRoute, permissionRoute];
          break;
        default:
          menu = [];
      }

      return resultSuccess(menu);
    },
  },
] as MockMethod[];
