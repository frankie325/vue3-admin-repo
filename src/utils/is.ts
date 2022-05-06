// 不是undefined，则为true
export function isDef<T = unknown>(val?: T): val is T {
    return typeof val !== "undefined";
}

// 是undefined，则为true
export function isUnDef<T = unknown>(val?: T): val is T {
    return !isDef(val);
}

// 是null，则为true
export function isNull(val: unknown): val is null {
    return val === null;
}

// 是null并且是undefined，则为true
// export function isNullAndUnDef(val: unknown): val is null | undefined {
//     return isNull(val) && isUnDef(val);
// }

// 是null或者undefined，则为true
export function isNullOrUnDef(val: unknown): val is null | undefined {
    return isNull(val) || isUnDef(val);
}
