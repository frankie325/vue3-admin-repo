// 全局声明

declare interface Fn<T = any, R = T> {
  (...arg: T[]): R;
}
