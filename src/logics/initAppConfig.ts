import { useLocaleStore } from '@/store/modules/locale';

/**
 * @description:  初始化pinia仓库状态
 */
export function initAppConfigStore() {
  const localeStore = useLocaleStore();
  localeStore.initLocale();
}
