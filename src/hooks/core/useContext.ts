import {
  InjectionKey,
  provide,
  inject,
  reactive,
  readonly as defineReadonly,
  UnwrapRef,
} from 'vue';

export interface CreateContextOptions {
  readonly?: boolean;
  createProvider?: boolean; // 是否注入到组件
  native?: boolean; //是否按原样注入，如果不是，则会经过响应式处理
}

/**
 * @description: 创建上下文，即注入数据到组件中
 */
export function createContext<T>(
  context: any,
  key: InjectionKey<T> = Symbol(),
  options: CreateContextOptions = {},
) {
  const { readonly = true, createProvider = false, native = false } = options;

  const state = reactive(context);
  const provideData = readonly ? defineReadonly(state) : state;
  !createProvider && provide(key, native ? context : provideData);

  return {
    state,
  };
}

type ShallowUnwrap<T> = {
  [P in keyof T]: UnwrapRef<T[P]>;
};

/**
 * @description: 使用注入的数据
 */
export function useContext<T>(key: InjectionKey<T>, native?: boolean): T;
export function useContext<T>(key: InjectionKey<T>, defaultValue?: any, native?: boolean): T;
export function useContext<T>(
  key: InjectionKey<T> = Symbol(),
  defaultValue?: any,
): ShallowUnwrap<T> {
  return inject(key, defaultValue || {});
}
