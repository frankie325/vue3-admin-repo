export const SIDE_BAR_MINI_WIDTH = 48; // 折叠菜单时的宽度
export const SIDE_BAR_SHOW_TIT_MINI_WIDTH = 80; // 左侧混合模式菜单的宽度（折叠时显示菜单标题的宽度）

// 主题
export enum ThemeEnum {
  DARK = 'dark',
  LIGHT = 'light',
}

// token失效处理方案
export enum SessionTimeoutProcessingEnum {
  ROUTE_JUMP, // 路由跳转到登录页
  PAGE_COVERAGE, // 生成登录弹窗，覆盖当前页面
}

/**
 * 权限模式
 */
export enum PermissionModeEnum {
  // 前端角色权限，前端固定写死
  ROLE = 'ROLE',
  // back 后台动态获取
  BACK = 'BACK',
  // route mapping
  ROUTE_MAPPING = 'ROUTE_MAPPING',
}

// 框架内容切换时动画效果
export enum RouterTransitionEnum {
  ZOOM_FADE = 'zoom-fade',
  ZOOM_OUT = 'zoom-out',
  FADE_SIDE = 'fade-slide',
  FADE = 'fade',
  FADE_BOTTOM = 'fade-bottom',
  FADE_SCALE = 'fade-scale',
}

// 项目设置按钮的位置
export enum SettingButtonPositionEnum {
  AUTO = 'auto',
  HEADER = 'header',
  FIXED = 'fixed',
}

// 内容宽度模式
export enum ContentEnum {
  // auto width
  FULL = 'full',
  // fixed width
  FIXED = 'fixed',
}
