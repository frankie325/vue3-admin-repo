import type { App } from 'vue';
import type { I18nOptions } from 'vue-i18n';
import { createI18n } from 'vue-i18n';

import { localeSetting } from '@/settings/localeSetting';
import { useLocaleStoreWithOut } from '@/store/modules/locale';
import { setHtmlPageLang, setLoadLocalePool } from './helper';

const { fallback, availableLocales } = localeSetting;

/**
 * @description: 初始化vue-i18n的选项
 */
async function createI18nOptions(): Promise<I18nOptions> {
  const localeStore = useLocaleStoreWithOut();
  const locale = localeStore.getLocale;
  const defaultLocal = await import(`./lang/${locale}.ts`);
  const message = defaultLocal.default?.message ?? {};
  // 设置html的lang属性
  setHtmlPageLang(locale);
  // 将当前语言存储到loadLocalePool数组中
  setLoadLocalePool((loadLocalePool) => {
    loadLocalePool.push(locale);
  });

  return {
    legacy: false, // 不使用v8版本遗留的api，否则不支持composition语法
    locale, // 当前语言
    messages: {
      [locale]: message,
    },
    fallbackLocale: fallback, // 默认语言环境
    availableLocales: availableLocales, // 可用语言环境列表
    sync: true, //根级别语言环境与组件本地化语言环境同步
    missingWarn: true, //关闭本地化失败时输出的警告
    // globalInjection: true,
  };
}

export let i18n: ReturnType<typeof createI18n>;

/**
 * @description: 安装国际化插件
 */
export async function setupI18n(app: App) {
  const options = await createI18nOptions();
  i18n = createI18n(options);
  app.use(i18n);
}
