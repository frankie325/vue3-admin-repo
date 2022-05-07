import type { LocaleSetting, LocaleType } from '#/config';

import { defineStore } from 'pinia';
import { store } from '@/store';

import { createLocalStorage } from '@/utils/cache';
import { LOCALE_KEY } from '@/enums/cacheEnum';
import { localeSetting } from '@/settings/localeSetting';

const ls = createLocalStorage();

const lsLocaleSetting = (ls.get(LOCALE_KEY) || localeSetting) as LocaleSetting;
interface LocaleState {
  localeInfo: LocaleSetting;
}

export const useLocaleStore = defineStore({
  id: 'app-locale',
  state: (): LocaleState => ({
    localeInfo: lsLocaleSetting,
  }),
  getters: {
    getShowPicker(): boolean {
      return !!this.localeInfo?.showPicker;
    },
    getLocale(): LocaleType {
      return this.localeInfo?.locale ?? 'zh_CN';
    },
  },
});

export function useLocaleStoreWithOut() {
  return useLocaleStore(store);
}
