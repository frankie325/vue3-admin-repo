// 本地存储选项设置

import { isDevMode } from '@/utils/env';

// 默认缓存时间：7天
export const DEFAULT_CACHE_TIME = 60 * 60 * 24 * 7;

// 加密密钥16位，前后端保持一致
export const cacheCipher = {
  key: '_11111000001111@', // 密钥
  iv: '@11111000001111_', // 密钥偏移量
};

// 是否使用加密系统缓存，生产环境下才加密
export const enableStorageEncryption = !isDevMode();
