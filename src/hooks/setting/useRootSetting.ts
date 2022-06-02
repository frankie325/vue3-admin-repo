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
  // 内容宽度模式
  const getContentMode = computed(() => appStore.getProjectConfig.contentMode);

  // 是否显示面包屑
  const getShowBreadCrumb = computed(() => appStore.getProjectConfig.showBreadCrumb);
  // 是否显示面包屑图标
  const getShowBreadCrumbIcon = computed(() => appStore.getProjectConfig.showBreadCrumbIcon);
  // 屏幕自动锁定时间
  const getLockTime = computed(() => appStore.getProjectConfig.lockTime);
  // 是否显示页脚
  const getShowFooter = computed(() => appStore.getProjectConfig.showFooter);
  // 是否全屏显示内容，不显示菜单
  const getFullContent = computed(() => appStore.getProjectConfig.fullContent);
  // 是否开启灰色模式
  const getGrayMode = computed(() => appStore.getProjectConfig.grayMode);
  // 是否开启色弱模式
  const getColorWeak = computed(() => appStore.getProjectConfig.colorWeak);
  // 是否显示返回顶部按钮
  const getUseOpenBackTop = computed(() => appStore.getProjectConfig.useOpenBackTop);

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
    getContentMode,
    getLockTime,
    getShowFooter,
    getFullContent,
    getGrayMode,
    getColorWeak,
    getUseOpenBackTop,
    setDarkMode,
  };
}
