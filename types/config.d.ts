import { CacheTypeEnum } from '@/enums/cacheEnum';
import {
  ContentEnum,
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

export interface TransitionSetting {
  //  Whether to open the page switching animation
  enable: boolean;
  // Route basic switching animation
  basicTransition: RouterTransitionEnum;
  // Whether to open page switching loading
  openPageLoading: boolean;
  // Whether to open the top progress bar
  openNProgress: boolean;
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

// 标签页设置
export interface MultiTabsSetting {
  cache: boolean;
  show: boolean;
  showQuick: boolean;
  canDrag: boolean;
  showRedo: boolean;
  showFold: boolean;
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
  // 是否显示logo
  showLogo: boolean;
  // 是否显示面包屑
  showBreadCrumb: boolean;
  // 是否显示面包屑图标
  showBreadCrumbIcon: boolean;

  transitionSetting: TransitionSetting;
  // 头部设置
  headerSetting: HeaderSetting;
  // 菜单设置
  menuSetting: MenuSetting;
  // 标签页设置
  multiTabsSetting: MultiTabsSetting;
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
  // 内容宽度模式
  contentMode: ContentEnum;
  // 屏幕自动锁定时间
  lockTime: number;
  // 是否显示页脚
  showFooter: boolean;
  // 是否开启灰色模式
  grayMode: boolean;
  // 是否开启色弱模式
  colorWeak: boolean;
  // 是否显示返回顶部按钮
  useOpenBackTop: boolean;
}
