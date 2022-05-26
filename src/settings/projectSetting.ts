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
  headerSetting: {
    // 头部背景颜色
    bgColor: HEADER_PRESET_BG_COLOR_LIST[0],
    // 头部使用fixed布局
    fixed: true,
    // 是否显示头部
    show: true,
    // 头部主题，会跟随系统主题，也由头部颜色深浅来决定
    theme: ThemeEnum.LIGHT,
    // Whether to enable the lock screen function
    useLockPage: true,
    // Whether to show the full screen button
    showFullScreen: true,
    // Whether to show the document button
    showDoc: true,
    // Whether to show the notification button
    showNotice: true,
    // Whether to display the menu search
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
    collapsedShowTitle: false,
    // Whether it can be dragged
    // Only limited to the opening of the left menu, the mouse has a drag bar on the right side of the menu
    canDrag: false,
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
    // Menu theme
    theme: ThemeEnum.DARK,
    // Split menu
    split: false,
    // Top menu layout
    topMenuAlign: 'center',
    // 菜单折叠按钮的位置
    trigger: TriggerEnum.HEADER,
    // Turn on accordion mode, only show a menu
    accordion: true,
    // Switch page to close menu
    closeMixSidebarOnChange: false,
    // Module opening method ‘click’ |'hover'
    mixSideTrigger: MixSidebarTriggerEnum.CLICK,
    // 是否固定展开菜单
    mixSideFixed: false,
  },
  multiTabsSetting: {
    cache: false,
    // 是否显示标签页
    show: true,
    // Is it possible to drag and drop sorting tabs
    canDrag: true,
    // Turn on quick actions
    showQuick: true,
    // Whether to show the refresh button
    showRedo: true,
    // Whether to show the collapse button
    showFold: true,
  },

  permissionCacheType: CacheTypeEnum.LOCAL,

  sessionTimeoutProcessing: SessionTimeoutProcessingEnum.ROUTE_JUMP,

  permissionMode: PermissionModeEnum.ROUTE_MAPPING,
};

export default setting;
