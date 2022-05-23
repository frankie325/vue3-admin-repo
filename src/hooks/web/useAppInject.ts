import { useAppProviderContext } from '@/components/Application';
import { computed, unref } from 'vue';

/**
 * @description: 使用全局注入的数据
 */
export function useAppInject() {
  const values = useAppProviderContext();

  return {
    getIsMobile: computed(() => unref(values.isMobile)),
  };
}
