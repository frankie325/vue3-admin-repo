import type { ProjectConfig } from '#/config';
import { CacheTypeEnum } from '@/enums/cacheEnum';
import {
  ContentEnum,
  PermissionModeEnum,
  ThemeEnum,
  RouterTransitionEnum,
  SettingButtonPositionEnum,
  SessionTimeoutProcessingEnum,
} from '@/enums/appEnum';
import { MenuTypeEnum, MenuModeEnum, TriggerEnum, MixSidebarTriggerEnum } from '@/enums/menuEnum';

import { SIDE_BAR_BG_COLOR_LIST, HEADER_PRESET_BG_COLOR_LIST } from './designSetting';
import { primaryColor } from '../../build/config/themeConfig';

const setting: ProjectConfig = {
  // 是否显示项目设置按钮
  showSettingButton: true,
  // 项目设置按钮的位置
  settingButtonPosition: SettingButtonPositionEnum.AUTO,
  // 是否显示黑暗模式切换按钮
  showDarkModeToggle: true,
  // 是否显示错误日志按钮
  useErrorHandle: true,
  // 是否全屏显示内容，不显示菜单
  fullContent: false,
  // 系统主题颜色
  themeColor: primaryColor,
  // 是否显示logo
  showLogo: true,
  // 是否显示面包屑
  showBreadCrumb: true,
  // 是否显示面包屑图标
  showBreadCrumbIcon: false,
  // 内容宽度模式
  contentMode: ContentEnum.FULL,
  // 屏幕自动锁定时间，0不锁定，单位为分钟
  lockTime: 0,
  // 是否显示页脚
  showFooter: false,
  // 是否开启灰色模式
  grayMode: false,
  // 是否开启色弱模式
  colorWeak: false,
  // 是否显示返回顶部按钮
  useOpenBackTop: true,
  // 是否开启KeepAlive缓存，最好在开发环境下关闭，否则缓存每次都要清除
  openKeepAlive: true,
  // 框架内是否允许内嵌页面
  canEmbedIFramePage: true,
  // 路由切换时，是否删除未关闭的 messages 和 notify
  closeMessageOnSwitch: true,
  // 路由切换时，是否取消前一个路由页面的请求
  removeAllHttpPending: false,

  // Transition Setting
  transitionSetting: {
    // 是否启用框架内页面切换时动画效果
    enable: true,
    // 框架内页面切换时动画效果
    basicTransition: RouterTransitionEnum.FADE_SIDE,
    // 框架内容是否启用加载动画
    openPageLoading: true,
    // Whether to open the top progress bar
    openNProgress: false,
  },
  headerSetting: {
    // 头部背景颜色
    bgColor: HEADER_PRESET_BG_COLOR_LIST[0],
    // 头部使用fixed布局
    fixed: true,
    // 是否显示头部
    show: true,
    // 头部主题，会跟随系统主题，也由头部颜色深浅来决定
    theme: ThemeEnum.LIGHT,
    // 是否使用屏幕锁定功能
    useLockPage: true,
    // 是否显示全屏按钮
    showFullScreen: true,
    // 是否显示消息通知按钮
    showNotice: true,
    // 是否展示菜单搜索
    showSearch: true,
  },
  menuSetting: {
    // 侧边菜单颜色
    bgColor: SIDE_BAR_BG_COLOR_LIST[0],
    // 左侧菜单是否使用fixed布局
    fixed: true,
    // 是否折叠菜单
    collapsed: false,
    // 折叠菜单时是否显示标题
    collapsedShowTitle: true,
    // 侧边菜单是否可以拖拽延伸宽度
    canDrag: true,
    // 是否显示菜单，不会创建DOM
    show: true,
    // 是否隐藏菜单，隐藏DOM
    hidden: false,
    // 菜单宽度
    menuWidth: 210,
    // 菜单模式
    mode: MenuModeEnum.INLINE,
    // 菜单类型
    type: MenuTypeEnum.SIDEBAR,
    // 菜单主题
    theme: ThemeEnum.DARK,
    // 是否分割菜单
    split: false,
    // 顶部菜单对齐方式
    topMenuAlign: 'center',
    // 菜单折叠按钮的位置
    trigger: TriggerEnum.HEADER,
    // 是否为手风琴模式，只打开一个菜单
    accordion: false,
    // 混合菜单切换页面时是否关闭菜单
    closeMixSidebarOnChange: false,
    // 混合菜单展开时的触发方式
    mixSideTrigger: MixSidebarTriggerEnum.CLICK,
    // 是否固定展开菜单
    mixSideFixed: false,
  },
  multiTabsSetting: {
    // 是否缓存标签页数据
    cache: false,
    // 是否显示标签页
    show: true,
    // 标签页是否可以拖拽
    canDrag: true,
    // 是否打开标签页快捷操作
    showQuick: true,
    // 是否显示标签页刷新按钮
    showRedo: true,
    // 是否显示标签页折叠（内容全屏）按钮
    showFold: true,
  },

  permissionCacheType: CacheTypeEnum.LOCAL,

  sessionTimeoutProcessing: SessionTimeoutProcessingEnum.ROUTE_JUMP,

  permissionMode: PermissionModeEnum.ROUTE_MAPPING,
};

export default setting;
