import type { GlobEnvConfig } from '#/config';
import { getConfigFileName } from '@/build/getConfigFileName';
import { warn } from '@/utils/log';
import pkg from '../../package.json';

/**
 * @description: 是否是开发环境
 */
export function isDevMode(): boolean {
  return import.meta.env.DEV;
}

export function getCommonStoragePrefix() {
  const { VITE_GLOB_APP_SHORT_NAME } = getAppEnvConfig();
  return `${VITE_GLOB_APP_SHORT_NAME}__${getEnv()}`.toUpperCase();
}

/**
 * @description: 根据项目版本生成存储的键
 */
export function getStorageShortName() {
  return `${getCommonStoragePrefix()}${`__${pkg.version}`}__`.toUpperCase();
}

/**
 * @description: 获取APP全局环境变量
 */
export function getAppEnvConfig() {
  const ENV_NAME = getConfigFileName(import.meta.env);

  const ENV = import.meta.env.DEV
    ? (import.meta.env as unknown as GlobEnvConfig)
    : (window[ENV_NAME as any] as unknown as GlobEnvConfig);

  const {
    VITE_GLOB_APP_TITLE,
    VITE_GLOB_APP_SHORT_NAME,
    VITE_GLOB_API_URL,
    VITE_GLOB_API_URL_PREFIX,
    VITE_GLOB_UPLOAD_URL,
  } = ENV;

  // VITE_GLOB_APP_SHORT_NAME只能由数字字母下划线组成
  if (!/^[a-zA-z\_]*$/.test(VITE_GLOB_APP_SHORT_NAME)) {
    warn(
      'VITE_GLOB_APP_SHORT_NAME Variables can only be characters/underscores, please modify in the environment variables and re-running.',
    );
  }

  return {
    VITE_GLOB_APP_TITLE,
    VITE_GLOB_APP_SHORT_NAME,
    VITE_GLOB_API_URL,
    VITE_GLOB_API_URL_PREFIX,
    VITE_GLOB_UPLOAD_URL,
  };
}

export function getEnv(): string {
  return import.meta.env.MODE;
}
