import type { EncryptionParams } from '@/utils/cipher';
import { cacheCipher } from '@/settings/encryptionSetting';
import { AesEncryption } from '@/utils/cipher';
import { isNullOrUnDef } from '@/utils/is';

export interface CreateStorageParams extends EncryptionParams {
  prefixKey: string;
  storage: Storage;
  hasEncrypt: boolean;
  timeout?: Nullable<number>;
}

/**
 * @description: 使用WebStorage实例操作本地存储
 */
export const createStorage = ({
  key = cacheCipher.key,
  iv = cacheCipher.iv,
  prefixKey = '', // 存储时，key的前缀
  storage = sessionStorage, //默认使用sessionStorage
  hasEncrypt = true, //是否需要加密，默认为true
  timeout = null, // 默认过期时间
}: Partial<CreateStorageParams> = {}) => {
  const encryption = new AesEncryption({ key, iv });

  class WebStorage {
    private storage: Storage;
    private prefixKey?: string;
    private hasEncrypt: boolean;
    private encryption: AesEncryption;
    constructor() {
      this.storage = storage;
      this.prefixKey = prefixKey;
      this.hasEncrypt = hasEncrypt;
      this.encryption = encryption;
    }
    private getKey(key: string) {
      return `${this.prefixKey}${key}`.toUpperCase();
    }

    /**
     * @description: 设置本地存储
     * @param {string} key 键
     * @param {any} value 值
     * @param {number} expire 过期时间（s）
     */
    set(key: string, value: any, expire: number | null = timeout) {
      const stringData = JSON.stringify({
        value,
        time: Date.now(),
        expire: !isNullOrUnDef(expire) ? new Date().getTime() + expire * 1000 : null,
      });
      const stringifyValue = this.hasEncrypt
        ? this.encryption.encryptByAES(stringData)
        : stringData;
      this.storage.setItem(this.getKey(key), stringifyValue);
    }

    /**
     * @description: 取本地存储值
     * @param {string} key 键
     * @param {any} def
     */
    get(key: string, def: any = null): any {
      const val = this.storage.getItem(this.getKey(key));
      if (!val) return def;
      try {
        const decVal = this.hasEncrypt ? this.encryption.decryptByAES(val) : val;
        const data = JSON.parse(decVal);
        const { value, expire } = data;
        if (isNullOrUnDef(expire) || expire >= new Date().getTime()) {
          return value;
        }
        this.remove(key);
      } catch (e) {
        return def;
      }
    }

    /**
     * @description: 移除本地存储
     * @param {string} key 键
     */
    remove(key: string): void {
      this.storage.removeItem(this.getKey(key));
    }

    /**
     * @description: 移除所有本地存储
     */
    clear(): void {
      this.storage.clear();
    }
  }

  return new WebStorage();
};
