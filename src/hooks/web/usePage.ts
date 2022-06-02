import type { RouteLocationRaw, Router } from 'vue-router';

import { PageEnum } from '@/enums/pageEnum';
import { isString } from '@/utils/is';
import { unref } from 'vue';

import { useRouter } from 'vue-router';
import { REDIRECT_NAME } from '@/router/constant';

export type RouteLocationRawEx = Omit<RouteLocationRaw, 'path'> & { path: PageEnum };

function handleError(e: Error) {
  console.error(e);
}

// page switch
export function useGo(_router?: Router) {
  let router;
  if (!_router) {
    router = useRouter();
  }
  const { push, replace } = (_router || router) as Router;

  /**
   * @description: 路由跳转
   */
  function go(opt: PageEnum | RouteLocationRawEx | string = PageEnum.BASE_HOME, isReplace = false) {
    if (!opt) {
      return;
    }
    if (isString(opt)) {
      isReplace ? replace(opt).catch(handleError) : push(opt).catch(handleError);
    } else {
      const o = opt as RouteLocationRaw;
      isReplace ? replace(o).catch(handleError) : push(o).catch(handleError);
    }
  }
  return go;
}

/**
 * @description: 刷新当前路由页面
 */
export const useRedo = (_router?: Router) => {
  const { push, currentRoute } = _router || useRouter();
  const { query, params = {}, name, fullPath } = unref(currentRoute.value);
  function redo(): Promise<boolean> {
    return new Promise((resolve) => {
      if (name === REDIRECT_NAME) {
        resolve(false);
        return;
      }
      // 将当前路由地址存到params中，给重定向页面使用
      if (name && Object.keys(params).length > 0) {
        // 使用name跳转
        params['_redirect_type'] = 'name';
        params['path'] = String(name);
      } else {
        // 使用path跳转
        params['_redirect_type'] = 'path';
        params['path'] = fullPath;
      }
      // 跳转到重定向页面
      push({ name: REDIRECT_NAME, params, query }).then(() => resolve(true));
    });
  }
  return redo;
};
