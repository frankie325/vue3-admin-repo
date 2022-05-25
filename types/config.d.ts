import { CacheTypeEnum } from '@/enums/cacheEnum';
import {
  PermissionModeEnum,
  SessionTimeoutProcessingEnum,
  SettingButtonPositionEnum,
} from '@/enums/appEnum';

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

// 头部设置
export interface HeaderSetting {
  bgColor: string;
  fixed: boolean;
  show: boolean;
  theme: ThemeEnum;
  showFullScreen: boolean;
  useLockPage: boolean;
  showDoc: boolean;
  showNotice: boolean;
  showSearch: boolean;
}

// 菜单设置
export interface MenuSetting {
  bgColor: string;
  fixed: boolean;
  collapsed: boolean;
  canDrag: boolean;
  show: boolean;
  hidden: boolean;
  split: boolean;
  menuWidth: number;
  mode: MenuModeEnum;
  type: MenuTypeEnum;
  theme: ThemeEnum;
  topMenuAlign: 'start' | 'center' | 'end';
  trigger: TriggerEnum;
  accordion: boolean;
  closeMixSidebarOnChange: boolean;
  collapsedShowTitle: boolean;
  mixSideTrigger: MixSidebarTriggerEnum;
  mixSideFixed: boolean;
}

export interface ProjectConfig {
  // 是否显示配置按钮
  showSettingButton: boolean;
  // 项目设置按钮的位置
  settingButtonPosition: SettingButtonPositionEnum;
  // 是否显示主题切换按钮
  showDarkModeToggle: boolean;
  // 系统主题颜色
  themeColor: string;
  // 头部设置
  headerSetting: HeaderSetting;
  // 菜单设置
  menuSetting: MenuSetting;
  // 权限缓存类型
  permissionCacheType: CacheTypeEnum;
  // 权限模式
  permissionMode: PermissionModeEnum;
  // 是否收集错误信息
  useErrorHandle: boolean;
  // 是否全屏显示内容，不显示菜单
  fullContent: false;

  // 会话超时处理方案
  sessionTimeoutProcessing: SessionTimeoutProcessingEnum;
}
