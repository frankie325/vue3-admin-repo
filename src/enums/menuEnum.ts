/**
 * @description: 菜单类型
 */
export enum MenuTypeEnum {
  // 左侧菜单
  SIDEBAR = 'sidebar',
  // 左侧菜单混合模式
  MIX_SIDEBAR = 'mix-sidebar',
  // mixin menu
  MIX = 'mix',
  // 顶部菜单
  TOP_MENU = 'top-menu',
}

// 菜单折叠触发器位置
export enum TriggerEnum {
  // 不显示
  NONE = 'NONE',
  // 菜单底部
  FOOTER = 'FOOTER',
  // 头部
  HEADER = 'HEADER',
}

export type Mode = 'vertical' | 'vertical-right' | 'horizontal' | 'inline';

// 菜单模式
export enum MenuModeEnum {
  VERTICAL = 'vertical',
  HORIZONTAL = 'horizontal',
  VERTICAL_RIGHT = 'vertical-right',
  INLINE = 'inline',
}

export enum MenuSplitTyeEnum {
  NONE,
  TOP,
  LEFT,
}

export enum TopMenuAlignEnum {
  CENTER = 'center',
  START = 'start',
  END = 'end',
}

export enum MixSidebarTriggerEnum {
  HOVER = 'hover',
  CLICK = 'click',
}
