import type { LocaleType } from '#/config';
import { computed, unref } from 'vue';

import { i18n } from './setupl18n';
import { useLocaleStoreWithOut } from '@/store/modules/locale';
import { loadLocalePool, setHtmlPageLang } from './helper';

/**
 * @description: 切换当前项目的语言环境
 */
function setI18nLanguage(locale: LocaleType) {
  const localeStore = useLocaleStoreWithOut();

  if (i18n.mode === 'legacy') {
    // v8版本直接
    i18n.global.locale = locale;
  } else {
    // v9版本为Ref
    (i18n.global.locale as any).value = locale;
  }

  // 更新locale仓库信息
  localeStore.setLocaleInfo({ locale });
  // 更新html的lang属性
  setHtmlPageLang(locale);
}

export function useLocale() {
  const localeStore = useLocaleStoreWithOut();
  const getLocale = computed(() => localeStore.getLocale);
  const getShowLocalePicker = computed(() => localeStore.getShowPicker);

  // 获取ant-design的Message
  const getAntdLocale = computed(() => {
    return i18n.global.getLocaleMessage(unref(getLocale)).antdLocale ?? {};
  });

  // 切换当前项目的语言环境
  async function changeLocale(locale: LocaleType) {
    const globalI18n = i18n.global;
    const currentLocale = globalI18n.locale;
    if (currentLocale === locale) {
      return locale;
    }

    // 如果已经存在于loadLocalePool，说明已经设置过该语言的message，只更新仓库信息即可
    if (loadLocalePool.includes(locale)) {
      setI18nLanguage(locale);
      return locale;
    }

    const langModule = (await import(`./lang/${locale}.ts`)).default;
    if (!langModule) return;
    // 设置该语言的message
    const { message } = langModule;
    globalI18n.setLocaleMessage(locale, message);
    loadLocalePool.push(locale);

    setI18nLanguage(locale);
    return locale;
  }

  return {
    getLocale,
    getShowLocalePicker,
    getAntdLocale,
    changeLocale,
  };
}
