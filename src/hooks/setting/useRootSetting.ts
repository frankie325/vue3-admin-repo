import { computed } from 'vue';
import { useAppStore } from '@/store/modules/app';
import { ThemeEnum } from '@/enums/appEnum';

export function useRootSetting() {
  const appStore = useAppStore();

  // 是否显示项目设置按钮
  const getShowSettingButton = computed(() => appStore.getProjectConfig.showSettingButton);
  // 项目设置按钮的位置
  const getSettingButtonPosition = computed(() => appStore.getProjectConfig.settingButtonPosition);
  // 是否显示错误日志按钮
  const getUseErrorHandle = computed(() => appStore.getProjectConfig.useErrorHandle);
  // 是否显示黑暗模式切换按钮
  const getShowDarkModeToggle = computed(() => appStore.getProjectConfig.showDarkModeToggle);
  // 获取当前黑暗模式
  const getDarkMode = computed(() => appStore.getDarkMode);
  // 获取系统主题颜色
  const getThemeColor = computed(() => appStore.getProjectConfig.themeColor);
  // 是否显示logo
  const getShowLogo = computed(() => appStore.getProjectConfig.showLogo);
  // 是否显示面包屑
  const getShowBreadCrumb = computed(() => appStore.getProjectConfig.showBreadCrumb);
  // 是否显示面包屑图标
  const getShowBreadCrumbIcon = computed(() => appStore.getProjectConfig.showBreadCrumbIcon);

  function setDarkMode(mode: ThemeEnum) {
    appStore.setDarkMode(mode);
  }

  return {
    getShowSettingButton,
    getSettingButtonPosition,
    getUseErrorHandle,
    getShowDarkModeToggle,
    getDarkMode,
    getThemeColor,
    getShowLogo,
    getShowBreadCrumb,
    getShowBreadCrumbIcon,
    setDarkMode,
  };
}
