import { defineComponent, unref, computed } from 'vue';

import { AppDarkModeToggle } from '@/components/Application';

import {
  TypePicker,
  ThemeColorPicker,
  SwitchItem,
  SelectItem,
  InputNumberItem,
  SettingFooter,
} from './components';

import { useI18n } from '@/hooks/web/useI18n';
import { useRootSetting } from '@/hooks/setting/useRootSetting';
import { useMenuSetting } from '@/hooks/setting/useMenuSetting';
import { useHeaderSetting } from '@/hooks/setting/useHeaderSetting';
import { useMultipleTabSetting } from '@/hooks/setting/useMultipleTabSetting';
import { useTransitionSetting } from '@/hooks/setting/useTransitionSetting';

import {
  menuTypeList,
  HandlerEnum,
  getMenuTriggerOptions,
  mixSidebarTriggerOptions,
  topMenuAlignOptions,
  contentModeOptions,
  routerTransitionOptions,
} from './enum';
import { MenuTypeEnum, TriggerEnum } from '@/enums/menuEnum';

import {
  HEADER_PRESET_BG_COLOR_LIST,
  SIDE_BAR_BG_COLOR_LIST,
  APP_PRESET_COLOR_LIST,
} from '@/settings/designSetting';
import { baseHandler } from './handler';

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

    const {
      getShowDarkModeToggle,
      getThemeColor,
      getContentMode,
      getLockTime,
      getShowBreadCrumb,
      getShowBreadCrumbIcon,
      getShowLogo,
      getShowFooter,
      getFullContent,
      getGrayMode,
      getColorWeak,
    } = useRootSetting();
    const {
      getHeaderBgColor,
      getShowSearch,
      getShowHeader,
      getFixed: getHeaderFixed,
    } = useHeaderSetting();
    const { getShowMultipleTab, getShowQuick, getShowRedo, getShowFold } = useMultipleTabSetting();
    const { getOpenPageLoading, getBasicTransition, getEnableTransition, getOpenNProgress } =
      useTransitionSetting();
    // 是否显示菜单
    const getShowMenuRef = computed(() => {
      return unref(getShowMenu) && !unref(getIsHorizontal);
    });

    const {
      getMenuType,
      getMenuBgColor,
      getIsMixSidebar,
      getShowMenu,
      getTrigger,
      getSplit,
      getIsHorizontal,
      getMixSideFixed,
      getCloseMixSidebarOnChange,
      getCollapsed,
      getCanDrag,
      getAccordion,
      getCollapsedShowTitle,
      getMenuFixed,
      getMixSideTrigger,
      getTopMenuAlign,
      getIsTopMenu,
      getMenuWidth,
    } = useMenuSetting();

    function renderSidebar() {
      return (
        <TypePicker
          //@ts-ignore
          menuTypeList={menuTypeList}
          handler={(item: typeof menuTypeList[0]) => {
            baseHandler(HandlerEnum.CHANGE_LAYOUT, {
              mode: item.mode,
              type: item.type,
              split: unref(getIsHorizontal) ? false : undefined,
            });
          }}
          def={unref(getMenuType)}
        />
      );
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

    function renderFeatures() {
      const triggerDef = unref(getTrigger);

      const triggerOptions = getMenuTriggerOptions(unref(getSplit));

      return (
        <>
          <SwitchItem
            //@ts-ignore
            title={t('layout.setting.splitMenu')}
            event={HandlerEnum.MENU_SPLIT}
            def={unref(getSplit)}
            disabled={!unref(getShowMenuRef) || unref(getMenuType) !== MenuTypeEnum.MIX}
          />
          <SwitchItem
            //@ts-ignore
            title={t('layout.setting.mixSidebarFixed')}
            event={HandlerEnum.MENU_FIXED_MIX_SIDEBAR}
            def={unref(getMixSideFixed)}
            disabled={!unref(getIsMixSidebar)}
          />

          <SwitchItem
            //@ts-ignore
            title={t('layout.setting.closeMixSidebarOnChange')}
            event={HandlerEnum.MENU_CLOSE_MIX_SIDEBAR_ON_CHANGE}
            def={unref(getCloseMixSidebarOnChange)}
            disabled={!unref(getIsMixSidebar)}
          />

          <SwitchItem
            //@ts-ignore
            title={t('layout.setting.menuCollapse')}
            event={HandlerEnum.MENU_COLLAPSED}
            def={unref(getCollapsed)}
            disabled={!unref(getShowMenuRef)}
          />

          <SwitchItem
            //@ts-ignore
            title={t('layout.setting.menuDrag')}
            event={HandlerEnum.MENU_HAS_DRAG}
            def={unref(getCanDrag)}
            disabled={!unref(getShowMenuRef)}
          />

          <SwitchItem
            //@ts-ignore
            title={t('layout.setting.menuSearch')}
            event={HandlerEnum.HEADER_SEARCH}
            def={unref(getShowSearch)}
            disabled={!unref(getShowHeader)}
          />

          <SwitchItem
            //@ts-ignore
            title={t('layout.setting.menuAccordion')}
            event={HandlerEnum.MENU_ACCORDION}
            def={unref(getAccordion)}
            disabled={!unref(getShowMenuRef)}
          />

          <SwitchItem
            //@ts-ignore
            title={t('layout.setting.collapseMenuDisplayName')}
            event={HandlerEnum.MENU_COLLAPSED_SHOW_TITLE}
            def={unref(getCollapsedShowTitle)}
            disabled={!unref(getShowMenuRef) || !unref(getCollapsed) || unref(getIsMixSidebar)}
          />

          <SwitchItem
            //@ts-ignore
            title={t('layout.setting.fixedHeader')}
            event={HandlerEnum.HEADER_FIXED}
            def={unref(getHeaderFixed)}
            disabled={!unref(getShowHeader)}
          />

          <SwitchItem
            //@ts-ignore
            title={t('layout.setting.fixedSideBar')}
            event={HandlerEnum.MENU_FIXED}
            def={unref(getMenuFixed)}
            disabled={!unref(getShowMenuRef) || unref(getIsMixSidebar)}
          />

          <SelectItem
            //@ts-ignore
            title={t('layout.setting.mixSidebarTrigger')}
            event={HandlerEnum.MENU_TRIGGER_MIX_SIDEBAR}
            def={unref(getMixSideTrigger)}
            options={mixSidebarTriggerOptions}
            disabled={!unref(getIsMixSidebar)}
          />

          <SelectItem
            //@ts-ignore
            title={t('layout.setting.topMenuLayout')}
            event={HandlerEnum.MENU_TOP_ALIGN}
            def={unref(getTopMenuAlign)}
            options={topMenuAlignOptions}
            disabled={
              !unref(getShowHeader) ||
              unref(getSplit) ||
              (!unref(getIsTopMenu) && !unref(getSplit)) ||
              unref(getIsMixSidebar)
            }
          />

          <SelectItem
            //@ts-ignore
            title={t('layout.setting.menuCollapseButton')}
            event={HandlerEnum.MENU_TRIGGER}
            def={triggerDef}
            options={triggerOptions}
            disabled={!unref(getShowMenuRef) || unref(getIsMixSidebar)}
          />

          <SelectItem
            //@ts-ignore
            title={t('layout.setting.contentMode')}
            event={HandlerEnum.CONTENT_MODE}
            def={unref(getContentMode)}
            options={contentModeOptions}
          />

          <InputNumberItem
            //@ts-ignore
            title={t('layout.setting.autoScreenLock')}
            min={0}
            event={HandlerEnum.LOCK_TIME}
            defaultValue={unref(getLockTime)}
            formatter={(value: string) => {
              return parseInt(value) === 0
                ? `0(${t('layout.setting.notAutoScreenLock')})`
                : `${value}${t('layout.setting.minute')}`;
            }}
          />

          <InputNumberItem
            //@ts-ignore
            title={t('layout.setting.expandedMenuWidth')}
            max={600}
            min={100}
            step={10}
            event={HandlerEnum.MENU_WIDTH}
            disabled={!unref(getShowMenuRef)}
            defaultValue={unref(getMenuWidth)}
            formatter={(value: string) => `${parseInt(value)}px`}
          />
        </>
      );
    }

    function renderContent() {
      return (
        <>
          <SwitchItem
            //@ts-ignore
            title={t('layout.setting.breadcrumb')}
            event={HandlerEnum.SHOW_BREADCRUMB}
            def={unref(getShowBreadCrumb)}
            disabled={!unref(getShowHeader)}
          />

          <SwitchItem
            //@ts-ignore
            title={t('layout.setting.breadcrumbIcon')}
            event={HandlerEnum.SHOW_BREADCRUMB_ICON}
            def={unref(getShowBreadCrumbIcon)}
            disabled={!unref(getShowHeader)}
          />

          <SwitchItem
            //@ts-ignore
            title={t('layout.setting.tabs')}
            event={HandlerEnum.TABS_SHOW}
            def={unref(getShowMultipleTab)}
          />

          <SwitchItem
            //@ts-ignore
            title={t('layout.setting.tabsRedoBtn')}
            event={HandlerEnum.TABS_SHOW_REDO}
            def={unref(getShowRedo)}
            disabled={!unref(getShowMultipleTab)}
          />

          <SwitchItem
            //@ts-ignore
            title={t('layout.setting.tabsQuickBtn')}
            event={HandlerEnum.TABS_SHOW_QUICK}
            def={unref(getShowQuick)}
            disabled={!unref(getShowMultipleTab)}
          />
          <SwitchItem
            //@ts-ignore
            title={t('layout.setting.tabsFoldBtn')}
            event={HandlerEnum.TABS_SHOW_FOLD}
            def={unref(getShowFold)}
            disabled={!unref(getShowMultipleTab)}
          />

          <SwitchItem
            //@ts-ignore
            title={t('layout.setting.sidebar')}
            event={HandlerEnum.MENU_SHOW_SIDEBAR}
            def={unref(getShowMenu)}
            disabled={unref(getIsHorizontal)}
          />

          <SwitchItem
            //@ts-ignore
            title={t('layout.setting.header')}
            event={HandlerEnum.HEADER_SHOW}
            def={unref(getShowHeader)}
          />

          <SwitchItem
            //@ts-ignore
            title="Logo"
            event={HandlerEnum.SHOW_LOGO}
            def={unref(getShowLogo)}
            disabled={unref(getIsMixSidebar)}
          />

          <SwitchItem
            //@ts-ignore
            title={t('layout.setting.footer')}
            event={HandlerEnum.SHOW_FOOTER}
            def={unref(getShowFooter)}
          />
          <SwitchItem
            //@ts-ignore
            title={t('layout.setting.fullContent')}
            event={HandlerEnum.FULL_CONTENT}
            def={unref(getFullContent)}
          />

          <SwitchItem
            //@ts-ignore
            title={t('layout.setting.grayMode')}
            event={HandlerEnum.GRAY_MODE}
            def={unref(getGrayMode)}
          />

          <SwitchItem
            //@ts-ignore
            title={t('layout.setting.colorWeak')}
            event={HandlerEnum.COLOR_WEAK}
            def={unref(getColorWeak)}
          />
        </>
      );
    }

    function renderTransition() {
      return (
        <>
          <SwitchItem
            //@ts-ignore
            title={t('layout.setting.progress')}
            event={HandlerEnum.OPEN_PROGRESS}
            def={unref(getOpenNProgress)}
          />
          <SwitchItem
            //@ts-ignore
            title={t('layout.setting.switchLoading')}
            event={HandlerEnum.OPEN_PAGE_LOADING}
            def={unref(getOpenPageLoading)}
          />

          <SwitchItem
            //@ts-ignore
            title={t('layout.setting.switchAnimation')}
            event={HandlerEnum.OPEN_ROUTE_TRANSITION}
            def={unref(getEnableTransition)}
          />

          <SelectItem
            //@ts-ignore
            title={t('layout.setting.animationType')}
            event={HandlerEnum.ROUTER_TRANSITION}
            def={unref(getBasicTransition)}
            options={routerTransitionOptions}
            disabled={!unref(getEnableTransition)}
          />
        </>
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
        <a-divider>{() => t('layout.setting.interfaceFunction')}</a-divider>
        {renderFeatures()}
        <a-divider>{() => t('layout.setting.interfaceDisplay')}</a-divider>
        {renderContent()}
        <a-divider>{() => t('layout.setting.animation')}</a-divider>
        {renderTransition()}
        <a-divider />
        <SettingFooter />
      </a-drawer>
    );
  },
});
