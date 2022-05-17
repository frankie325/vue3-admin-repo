import type { InjectionKey, Ref } from 'vue';
import { createContext, useContext } from '@/hooks/core/useContext';

export interface AppProviderContextProps {
  prefixCls: Ref<string>;
  isMobile: Ref<boolean>;
}

const key: InjectionKey<AppProviderContextProps> = Symbol();

/**
 * @description: 注入数据到AppProvider组件中
 */
export function createAppProviderContext(context: AppProviderContextProps) {
  return createContext<AppProviderContextProps>(context, key);
}

/**
 * @description: 使用注入到AppProvider组件中的数据
 */
export function useAppProviderContext() {
  return useContext<AppProviderContextProps>(key);
}
