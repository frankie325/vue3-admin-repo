import { parse } from "crypto-js/enc-utf8";
import { encrypt, decrypt } from "crypto-js/aes";
import ECB from "crypto-js/mode-ecb";
import pkcs7 from "crypto-js/pad-pkcs7";
import Base64 from "crypto-js/enc-base64";

export interface EncryptionParams {
    key: string; // 密钥
    iv: string; // 密钥偏移量
}

// 使用ASE加密解密
export class AesEncryption {
    private key;
    private iv;

    constructor(opt: EncryptionParams) {
        const { key, iv } = opt;
        this.key = parse(key);
        this.iv = parse(iv);
    }

    get getOptions() {
        return {
            mode: ECB, // 加密模式
            padding: pkcs7, // 填充方式
            iv: this.iv, // 偏移量
        };
    }

    // AES加密
    encryptByAES(cipherText: string) {
        return encrypt(cipherText, this.key, this.getOptions).toString();
    }

    // AES解密
    decryptByAES(cipherText: string) {
        return decrypt(cipherText, this.key, this.getOptions).toString(Base64);
    }
}
