import type { InjectionKey, Ref } from 'vue';
import type { Emitter } from '@/utils/mitt';
import { createContext, useContext } from '@/hooks/core/useContext';

export interface SimpleRootMenuContextProps {
  rootMenuEmitter: Emitter;
  activeName: Ref<string | number>;
}

const key: InjectionKey<SimpleRootMenuContextProps> = Symbol();

/**
 * @description: 注入数据
 */
export function createSimpleRootMenuContext(context: SimpleRootMenuContextProps) {
  return createContext<SimpleRootMenuContextProps>(context, key, { readonly: false, native: true });
}

/**
 * @description: 使用注入数据
 */
export function useSimpleRootMenuContext() {
  return useContext<SimpleRootMenuContextProps>(key);
}
