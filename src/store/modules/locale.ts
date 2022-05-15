import type { LocaleSetting, LocaleType } from '#/config';

import { defineStore } from 'pinia';
import { store } from '@/store';

import { createLocalStorage } from '@/utils/cache';
import { LOCALE_KEY } from '@/enums/cacheEnum';
import { LOCALE, localeSetting } from '@/settings/localeSetting';

// 使用localStorage将语言环境配置存储到本地
const ls = createLocalStorage();

const lsLocaleSetting = (ls.get(LOCALE_KEY) || localeSetting) as LocaleSetting;
interface LocaleState {
  localeInfo: LocaleSetting;
}

// 定义国际化语言配置信息仓库
export const useLocaleStore = defineStore({
  id: 'app-locale',
  state: (): LocaleState => ({
    localeInfo: lsLocaleSetting, //初始化时为默认配置
  }),
  getters: {
    getShowPicker(): boolean {
      return !!this.localeInfo?.showPicker;
    },
    // 获取当前环境语言
    getLocale(): LocaleType {
      return this.localeInfo?.locale ?? LOCALE.ZH_CN;
    },
  },
  actions: {
    // 更新localeInfo，并将信息存储到本地
    setLocaleInfo(info: Partial<LocaleSetting>) {
      this.localeInfo = { ...this.localeInfo, ...info };
      ls.set(LOCALE_KEY, this.localeInfo);
    },

    // 初始化仓库状态
    initLocale() {
      this.setLocaleInfo({
        ...localeSetting,
        ...this.localeInfo,
      });
    },
  },
});

export function useLocaleStoreWithOut() {
  return useLocaleStore(store);
}
