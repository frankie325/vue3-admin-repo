import { defineComponent, unref, computed } from 'vue';

import { AppDarkModeToggle } from '@/components/Application';
import { TypePicker, ThemeColorPicker } from './components';
import { useI18n } from '@/hooks/web/useI18n';
import { useRootSetting } from '@/hooks/setting/useRootSetting';
import { useMenuSetting } from '@/hooks/setting/useMenuSetting';
import { useHeaderSetting } from '@/hooks/setting/useHeaderSetting';

import { menuTypeList, HandlerEnum } from './enum';
import {
  HEADER_PRESET_BG_COLOR_LIST,
  SIDE_BAR_BG_COLOR_LIST,
  APP_PRESET_COLOR_LIST,
} from '@/settings/designSetting';

export default defineComponent({
  name: 'SettingDrawer',
  props: {
    visible: Boolean,
  },
  emits: ['update:visible'],
  setup(props, { attrs, emit }) {
    const { t } = useI18n();

    const showDrawer = computed({
      get: () => props.visible,
      set: (v) => {
        emit('update:visible', v);
      },
    });

    const { getShowDarkModeToggle, getThemeColor } = useRootSetting();
    const { getHeaderBgColor } = useHeaderSetting();

    const { getMenuType, getMenuBgColor, getShowSidebar, getIsMixSidebar, getShowMenu } =
      useMenuSetting();

    function renderSidebar() {
      //@ts-ignore
      return <TypePicker menuTypeList={menuTypeList} handle={() => {}} def={unref(getMenuType)} />;
    }

    function renderMainTheme() {
      return (
        <ThemeColorPicker
          //@ts-ignore
          colorList={APP_PRESET_COLOR_LIST}
          event={HandlerEnum.CHANGE_THEME_COLOR}
          def={unref(getThemeColor)}
        />
      );
    }

    function renderHeaderTheme() {
      return (
        <ThemeColorPicker
          //@ts-ignore
          colorList={HEADER_PRESET_BG_COLOR_LIST}
          def={unref(getHeaderBgColor)}
          event={HandlerEnum.HEADER_THEME}
        />
      );
    }

    function renderSiderTheme() {
      return (
        <ThemeColorPicker
          //@ts-ignore
          colorList={SIDE_BAR_BG_COLOR_LIST}
          def={unref(getMenuBgColor)}
          event={HandlerEnum.MENU_THEME}
        />
      );
    }
    return () => (
      <a-drawer width="320" v-model:visible={showDrawer.value} title="项目配置">
        {unref(getShowDarkModeToggle) && <a-divider>{t('layout.setting.darkMode')}</a-divider>}
        {unref(getShowDarkModeToggle) && <AppDarkModeToggle class="mx-auto" />}
        <a-divider>{t('layout.setting.navMode')}</a-divider>
        {renderSidebar()}
        <a-divider>{t('layout.setting.sysTheme')}</a-divider>
        {renderMainTheme()}
        <a-divider>{t('layout.setting.headerTheme')}</a-divider>
        {renderHeaderTheme()}
        <a-divider>{t('layout.setting.sidebarTheme')}</a-divider>
        {renderSiderTheme()}
        <a-button type="primary">按钮</a-button>
      </a-drawer>
    );
  },
});
