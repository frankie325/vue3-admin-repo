import type { UserInfo, LockInfo } from '#/store';
import type { ProjectConfig } from '#/config';
import type { RouteLocationNormalized } from 'vue-router';

import { toRaw } from 'vue';

import { Memory } from './memory';
import { DEFAULT_CACHE_TIME } from '@/settings/encryptionSetting';
import {
  TOKEN_KEY,
  USER_INFO_KEY,
  ROLES_KEY,
  LOCK_INFO_KEY,
  PROJ_CFG_KEY,
  APP_LOCAL_CACHE_KEY,
  APP_SESSION_CACHE_KEY,
  MULTIPLE_TABS_KEY,
} from '@/enums/cacheEnum';
import { createLocalStorage, createSessionStorage } from './index';

interface BasicStore {
  [TOKEN_KEY]: string | number | null | undefined;
  [USER_INFO_KEY]: UserInfo;
  [ROLES_KEY]: string[];
  [LOCK_INFO_KEY]: LockInfo;
  [PROJ_CFG_KEY]: ProjectConfig;
  [MULTIPLE_TABS_KEY]: RouteLocationNormalized[];
}

type LocalStore = BasicStore;

type SessionStore = BasicStore;

export type BasicKeys = keyof BasicStore;
type LocalKeys = keyof LocalStore;
type SessionKeys = keyof SessionStore;

const ls = createLocalStorage();
const ss = createSessionStorage();

const localMemory = new Memory(DEFAULT_CACHE_TIME);
const sessionMemory = new Memory(DEFAULT_CACHE_TIME);

export class Persistent {
  /**
   * @description: 获取缓存
   */
  static getLocal<T>(key: LocalKeys) {
    return localMemory.get(key)?.value as Nullable<T>;
  }

  /**
   * @description: 设置缓存
   * @param immediate 是否存储到localStorage
   */
  static setLocal(key: LocalKeys, value: LocalStore[LocalKeys], immediate = false): void {
    localMemory.set(key, toRaw(value));
    immediate && ls.set(APP_LOCAL_CACHE_KEY, localMemory.getCache);
  }

  /**
   * @description: 获取缓存
   */
  static getSession<T>(key: SessionKeys) {
    return sessionMemory.get(key)?.value as Nullable<T>;
  }

  /**
   * @description: 设置缓存
   * @param immediate 是否存储到sessionStorage
   */
  static setSession(key: SessionKeys, value: SessionStore[SessionKeys], immediate = false): void {
    sessionMemory.set(key, toRaw(value));
    immediate && ss.set(APP_SESSION_CACHE_KEY, sessionMemory.getCache);
  }
}
