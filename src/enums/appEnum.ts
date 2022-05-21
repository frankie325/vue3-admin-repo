// 主题
export enum ThemeEnum {
  DARK = 'dark',
  LIGHT = 'light',
}

// token超时处理方案
export enum SessionTimeoutProcessingEnum {
  ROUTE_JUMP, // 路由跳转到登录页
  PAGE_COVERAGE, // 生成登录弹窗，覆盖当前页面
}
