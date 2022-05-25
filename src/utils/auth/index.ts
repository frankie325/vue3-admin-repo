import { TOKEN_KEY } from '@/enums/cacheEnum';
import projectSetting from '@/settings/projectSetting';
import { CacheTypeEnum } from '@/enums/cacheEnum';
import { Persistent, BasicKeys } from '../cache/persistent';
// 权限本地存储类型
const { permissionCacheType } = projectSetting;
const isLocal = permissionCacheType === CacheTypeEnum.LOCAL;

// 获取token
export function getToken() {
  return getAuthCache(TOKEN_KEY);
}

/**
 * @description: 获取权限缓存
 */
export function getAuthCache<T>(key: BasicKeys) {
  const fn = isLocal ? Persistent.getLocal : Persistent.getSession;
  return fn(key) as T;
}

/**
 * @description: 将用户权限进行缓存，并立即存储到本地
 */
export function setAuthCache(key: BasicKeys, value: any) {
  const fn = isLocal ? Persistent.setLocal : Persistent.setSession;
  return fn(key, value, true);
}
