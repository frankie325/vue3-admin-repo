// 扩展全局声明的类型
declare global {
    // 声明以字符串类型为键，以T类型为值，不传则以any类型为值的对象
    declare type Recordable<T = any> = Record<string, T>;
    // 声明为T类型或者null类型
    declare type Nullable<T> = T | null;
}

export {};
