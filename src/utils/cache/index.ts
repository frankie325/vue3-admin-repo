import { enableStorageEncryption, DEFAULT_CACHE_TIME } from '@/settings/encryptionSetting';
import { createStorage as create, CreateStorageParams } from './storageCache';
import { getStorageShortName } from '@/utils/env';

export type Options = Partial<CreateStorageParams>;

/**
 * @description: 生成WebStorage实例的配置项
 */
const createOptions = (storage: Storage, options: Options = {}): Options => ({
  hasEncrypt: enableStorageEncryption,
  storage,
  prefixKey: getStorageShortName(),
  ...options,
});

export const webStorage = create(createOptions(sessionStorage));

export default webStorage;

/**
 * @description: 创建WebStorage实例，并传入配置项
 */
export const createStorage = (storage: Storage = sessionStorage, options: Options = {}) => create(createOptions(storage, options));

export const createLocalStorage = (options: Options = {}) => createStorage(localStorage, { ...options, timeout: DEFAULT_CACHE_TIME });

export const createSessionStorage = (options: Options = {}) => createStorage(sessionStorage, { ...options, timeout: DEFAULT_CACHE_TIME });
