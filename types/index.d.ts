// 全局声明

declare interface Fn<T = any, R = T> {
  (...arg: T[]): R;
}

declare type TargetContext = '_self' | '_blank';

declare type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>;

declare type ComponentRef<T extends HTMLElement = HTMLDivElement> = ComponentElRef<T> | null;
