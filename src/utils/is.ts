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
