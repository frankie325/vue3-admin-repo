/**
 * @description: 不是undefined，则为true
 */
export function isDef<T = unknown>(val?: T): val is T {
  return typeof val !== 'undefined';
}

/**
 * @description: 是undefined，则为true
 */
export function isUnDef<T = unknown>(val?: T): val is T {
  return !isDef(val);
}

/**
 * @description: 是null，则为true
 */
export function isNull(val: unknown): val is null {
  return val === null;
}

// 是null并且是undefined，则为true
// export function isNullAndUnDef(val: unknown): val is null | undefined {
//     return isNull(val) && isUnDef(val);
// }

/**
 * @description: 是null或者undefined，则为true
 */
export function isNullOrUnDef(val: unknown): val is null | undefined {
  return isNull(val) || isUnDef(val);
}

const toString = Object.prototype.toString;

export function is(val: unknown, type: string) {
  return toString.call(val) === `[object ${type}]`;
}

/**
 * @description: 是否为对象
 */
export function isObject(val: any): val is Record<any, any> {
  return val !== null && is(val, 'Object');
}

/**
 * @description: 是否为方法
 */
export function isFunction(val: unknown): val is Function {
  return typeof val === 'function';
}

/**
 * @description: 是否为字符
 */
export function isString(val: unknown): val is string {
  return is(val, 'String');
}

/**
 * @description: 是否为数组
 */
export function isArray(val: any): val is Array<any> {
  return val && Array.isArray(val);
}

/**
 * @description: 是否为boolean值
 */
export function isBoolean(val: unknown): val is boolean {
  return is(val, 'Boolean');
}
/**
 * @description: 是否为url
 */
export function isUrl(path: string): boolean {
  const reg =
    /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
  return reg.test(path);
}

// 是否为服务端
export const isServer = typeof window === 'undefined';
