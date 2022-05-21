import { CacheTypeEnum } from '@/enums/cacheEnum';
import { SessionTimeoutProcessingEnum } from '@/enums/appEnum';

// 国际化语言设置接口
export type LocaleType = 'zh_CN' | 'en' | 'ru' | 'ja' | 'ko';

export interface LocaleSetting {
  // 是否显示语言切换按钮
  showPicker: boolean;
  // 语言环境
  locale: LocaleType;
  // 默认语言环境
  fallback: LocaleType;
  // 可用语言环境列表
  availableLocales: LocaleType[];
}

export interface GlobConfig {
  // 项目标题
  title: string;

  apiUrl: string;

  uploadUrl?: string;

  urlPrefix?: string;
  // 项目简称
  shortName: string;
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

export interface menuSetting {
  bgColor: String;
}
export interface ProjectConfig {
  // 是否显示配置按钮
  showSettingButton: boolean;
  // 是否显示主题切换按钮
  showDarkModeToggle: boolean;

  menuSetting: MenuSetting;
  // 权限缓存类型
  permissionCacheType: CacheTypeEnum;

  // 是否收集错误信息
  useErrorHandle: boolean;

  // 会话超时处理方案
  sessionTimeoutProcessing: SessionTimeoutProcessingEnum;
}
