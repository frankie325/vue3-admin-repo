import { computed } from 'vue';

import { useLocaleStoreWithOut } from '@/store/modules/locale';

async function createI18nOptions() {}

export function useLocale() {
  const localeStore = useLocaleStoreWithOut();
  const getLocale = computed(() => localeStore.getLocale);
  const getShowLocalePicker = computed(() => localeStore.getShowPicker);
}
