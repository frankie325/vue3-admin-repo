// 国际化语言设置

import type { LocaleSetting, LocaleType } from '#/config';

export const LOCALE: { [key: string]: LocaleType } = {
  ZH_CN: 'zh_CN',
  EN_US: 'en',
};

export const localeSetting: LocaleSetting = {
  showPicker: true,
  // 当前语言环境
  locale: LOCALE.ZH_CN,
  // 默认语言环境
  fallback: LOCALE.ZH_CN,
  // 可用语言环境列表
  availableLocales: [LOCALE.ZH_CN, LOCALE.EN_US],
};
