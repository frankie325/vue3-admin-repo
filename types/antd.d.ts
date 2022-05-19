declare module 'ant-design-vue/dist/theme' {
  export function getThemeVariables(opt: {
    dark?: boolean;
    compact?: boolean;
  }): Record<string, string>;
}
