<template>
  <div :class="[prefixCls, `${prefixCls}--${theme}`]">
    <a-breadcrumb :routes="routes">
      <template #itemRender="{ route, routes: routesMatched, paths }">
        <Icon :icon="getIcon(route)" v-if="getShowBreadCrumbIcon && getIcon(route)" />
        <span v-if="!hasRedirect(routesMatched, route)">
          {{ t(route.name || route.meta.title) }}
        </span>
        <router-link to="" v-else @click="handleClick(route, paths, $event)">
          {{ t(route.name || route.meta.title) }}
        </router-link>
      </template>
    </a-breadcrumb>
  </div>
</template>
<script lang="ts">
  import type { RouteLocationMatched } from 'vue-router';
  import { defineComponent, ref, watchEffect } from 'vue';
  import { useRouter } from 'vue-router';
  import type { Menu } from '@/router/types';

  import Icon from '@/components/Icon';

  import { propTypes } from '@/utils/propTypes';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useDesign } from '@/hooks/web/useDesign';
  import { useRootSetting } from '@/hooks/setting/useRootSetting';
  import { useGo } from '@/hooks/web/usePage';
  import { REDIRECT_NAME } from '@/router/constant';
  import { getMenus } from '@/router/menus';
  import { getAllParentPath } from '@/router/helper/menuHelper';
  import { filter } from '@/utils/helper/treeHelper';
  import { isString } from '@/utils/is';

  export default defineComponent({
    name: 'LayoutBreadcrumb',
    components: {
      Icon,
    },
    props: {
      theme: propTypes.oneOf(['dark', 'light']),
    },
    setup() {
      const { prefixCls } = useDesign('layout-breadcrumb');
      const routes = ref<RouteLocationMatched[]>([]);
      const { currentRoute } = useRouter();
      const { getShowBreadCrumbIcon } = useRootSetting();

      const go = useGo();

      const { t } = useI18n();

      /**
       * @description: 生成面包屑所需数据的格式
       */
      function getMatched(menus: Menu[], parent: string[]) {
        const metched: Menu[] = [];
        menus.forEach((item) => {
          if (parent.includes(item.path)) {
            metched.push({
              ...item,
              name: item.meta?.title || item.name,
            });
          }
          if (item.children?.length) {
            metched.push(...getMatched(item.children, parent));
          }
        });
        return metched;
      }

      /**
       * @description: 过滤不在面包屑上显示的数据
       */
      function filterItem(list: RouteLocationMatched[]) {
        return filter(list, (item) => {
          const { meta, name } = item;
          if (!meta) {
            return !!name;
          }
          const { title, hideBreadcrumb, hideMenu } = meta;
          if (!title || hideBreadcrumb || hideMenu) {
            return false;
          }
          return true;
        }).filter((item) => !item.meta?.hideBreadcrumb);
      }

      watchEffect(async () => {
        if (currentRoute.value.name === REDIRECT_NAME) return;

        const menus = await getMenus();
        const routeMatched = currentRoute.value.matched;

        const cur = routeMatched?.[routeMatched.length - 1]; //当前路由
        let path = currentRoute.value.path;

        if (cur && cur?.meta?.currentActiveMenu) {
          // 用户设置的激活路由
          path = cur.meta.currentActiveMenu as string;
        }

        const parent = getAllParentPath(menus, path); //父级路由的路径数组
        const filterMenus = menus.filter((item) => item.path === parent[0]); //找到顶层父级菜单
        const matched = getMatched(filterMenus, parent) as any;

        const breadcrumbList = filterItem(matched);

        // 当前路由添加到最后
        if (currentRoute.value.meta?.currentActiveMenu) {
          breadcrumbList.push({
            ...currentRoute.value,
            name: currentRoute.value.meta?.title || currentRoute.value.name,
          } as unknown as RouteLocationMatched);
        }
        routes.value = breadcrumbList;
      });

      // 面包屑最后一个为当前激活路由，渲染成span标签
      function hasRedirect(routes: RouteLocationMatched[], route: RouteLocationMatched) {
        return routes.indexOf(route) !== routes.length - 1;
      }
      // @ts-ignore
      function getIcon(route) {
        return route.icon || route.meta?.icon;
      }

      function handleClick(route: RouteLocationMatched, paths: string[], e: Event) {
        e?.preventDefault();
        const { children, redirect, meta } = route;

        if (children?.length && !redirect) {
          e?.stopPropagation();
          return;
        }
        if (meta?.carryParam) {
          return;
        }

        if (redirect && isString(redirect)) {
          go(redirect);
        } else {
          let goPath = '';
          // 如果数组路径只有1个长度
          if (paths.length === 1) {
            goPath = paths[0];
          } else {
            // 否则取最后一个
            const ps = paths.slice(1);
            const lastPath = ps.pop() || '';
            goPath = `${lastPath}`;
          }
          // 不是以/开头则拼接上/
          goPath = /^\//.test(goPath) ? goPath : `/${goPath}`;
          go(goPath);
        }
      }

      return {
        prefixCls,
        getShowBreadCrumbIcon,
        routes,
        t,
        getIcon,
        hasRedirect,
        handleClick,
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-layout-breadcrumb';

  .@{prefix-cls} {
    display: flex;
    padding: 0 8px;
    align-items: center;

    .ant-breadcrumb-link {
      .anticon {
        margin-right: 4px;
        margin-bottom: 2px;
      }
    }

    &--light {
      .ant-breadcrumb-link {
        color: @breadcrumb-item-normal-color;

        a {
          color: rgb(0 0 0 / 65%);

          &:hover {
            color: @primary-color;
          }
        }
      }

      .ant-breadcrumb-separator {
        color: @breadcrumb-item-normal-color;
      }
    }

    &--dark {
      .ant-breadcrumb-link {
        color: rgb(255 255 255 / 60%);

        a {
          color: rgb(255 255 255 / 80%);

          &:hover {
            color: @white;
          }
        }
      }

      .ant-breadcrumb-separator,
      .anticon {
        color: rgb(255 255 255 / 80%);
      }
    }
  }
</style>
