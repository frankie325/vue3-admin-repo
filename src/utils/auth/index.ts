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

export function getAuthCache<T>(key: BasicKeys) {
  const fn = isLocal ? Persistent.getLocal : Persistent.getSession;
  return fn(key) as T;
}
