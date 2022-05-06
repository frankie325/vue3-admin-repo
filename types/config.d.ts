// 国际化语言设置接口
export type LocaleType = "zh_CN" | "en" | "ru" | "ja" | "ko";

export interface LocaleSetting {
    showPicker: boolean;
    // 语言环境
    locale: LocaleType;
    // 默认语言环境
    fallback: LocaleType;
    // 可用语言环境列表
    availableLocales: LocaleType[];
}

export interface GlobEnvConfig {
    // 项目标题
    VITE_GLOB_APP_TITLE: string;
    // 项目简称
    VITE_GLOB_APP_SHORT_NAME: string;
    // Service interface url
    VITE_GLOB_API_URL: string;
    // Service interface url prefix
    VITE_GLOB_API_URL_PREFIX?: string;
    // Upload url
    VITE_GLOB_UPLOAD_URL?: string;
}
