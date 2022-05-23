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

const setting: ProjectConfig = {
  showSettingButton: true,

  showDarkModeToggle: true,

  useErrorHandle: true,

  fullContent: false,

  headerSetting: {
    // header bg color
    bgColor: HEADER_PRESET_BG_COLOR_LIST[0],
    // Fixed at the top
    fixed: true,
    // 是否显示头部
    show: true,
    // theme
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
    //  Whether to fix the left menu
    fixed: true,
    // 是否折叠菜单
    collapsed: false,
    // Whether to display the menu name when folding the menu
    collapsedShowTitle: false,
    // Whether it can be dragged
    // Only limited to the opening of the left menu, the mouse has a drag bar on the right side of the menu
    canDrag: false,
    // 是否显示菜单，不会创建DOM
    show: true,
    // Whether to show dom
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
    // Fold trigger position
    trigger: TriggerEnum.HEADER,
    // Turn on accordion mode, only show a menu
    accordion: true,
    // Switch page to close menu
    closeMixSidebarOnChange: false,
    // Module opening method ‘click’ |'hover'
    mixSideTrigger: MixSidebarTriggerEnum.CLICK,
    // Fixed expanded menu
    mixSideFixed: false,
  },

  permissionCacheType: CacheTypeEnum.LOCAL,

  sessionTimeoutProcessing: SessionTimeoutProcessingEnum.ROUTE_JUMP,

  permissionMode: PermissionModeEnum.ROUTE_MAPPING,
};

export default setting;
