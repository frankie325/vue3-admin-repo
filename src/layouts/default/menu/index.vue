<script lang="tsx">
  import type { PropType, CSSProperties } from 'vue';
  import { computed, defineComponent, unref, toRef } from 'vue';

  import { AppLogo } from '@/components/Application';
  import { ScrollContainer } from '@/components/Container';
  import { SimpleMenu } from '@/components/SimpleMenu';
  import { BasicMenu } from '@/components/Menu';

  import { useDesign } from '@/hooks/web/useDesign';
  import { useAppInject } from '@/hooks/web/useAppInject';
  import { useRootSetting } from '@/hooks/setting/useRootSetting';
  import { useMenuSetting } from '@/hooks/setting/useMenuSetting';
  import { useGo } from '@/hooks/web/usePage';
  import { propTypes } from '@/utils/propTypes';
  import { MenuModeEnum, MenuSplitTyeEnum } from '@/enums/menuEnum';
  import { isUrl } from '@/utils/is';
  import { openWindow } from '@/utils';
  import { useSplitMenu } from './useLayoutMenu';

  export default defineComponent({
    name: 'LayoutMenu',
    props: {
      theme: propTypes.oneOf(['light', 'dark']),
      // 分割菜单类型
      splitType: {
        type: Number as PropType<MenuSplitTyeEnum>,
        default: MenuSplitTyeEnum.NONE,
      },
      isHorizontal: propTypes.bool,
      // 菜单模式
      menuMode: {
        type: [String] as PropType<Nullable<MenuModeEnum>>,
        default: '',
      },
    },
    setup(props) {
      const go = useGo();

      const { getShowLogo } = useRootSetting();
      const { prefixCls } = useDesign('layout-menu');

      const { getIsMobile } = useAppInject();

      const {
        getCollapsed,
        getAccordion,
        getCollapsedShowTitle,
        getIsSidebarType,
        getMenuTheme,
        getIsHorizontal,
        getSplit,
        getMenuType,
        getMenuMode,
      } = useMenuSetting();

      // 只有左侧菜单模式需要展示菜单内的logo
      const getIsShowLogo = computed(() => unref(getShowLogo) && unref(getIsSidebarType));

      // 菜单主题
      const getComputedMenuTheme = computed(() => props.theme || unref(getMenuTheme));

      const getComputedMenuMode = computed(() =>
        unref(getIsMobile) ? MenuModeEnum.INLINE : props.menuMode || unref(getMenuMode),
      );

      const getLogoClass = computed(() => {
        return [
          `${prefixCls}-logo`,
          unref(getComputedMenuTheme),
          {
            [`${prefixCls}--mobile`]: unref(getIsMobile),
          },
        ];
      });
      function renderHeader() {
        if (!unref(getIsShowLogo) && !unref(getIsMobile)) return null;

        return (
          <AppLogo
            showTitle={!unref(getCollapsed)}
            class={unref(getLogoClass)}
            theme={unref(getComputedMenuTheme)}
          />
        );
      }

      // 菜单是否需要滚动
      const getUseScroll = computed(() => {
        return (
          !unref(getIsHorizontal) &&
          (unref(getIsSidebarType) ||
            props.splitType === MenuSplitTyeEnum.LEFT ||
            props.splitType === MenuSplitTyeEnum.NONE)
        );
      });

      // 滚动区域的高度
      const getWrapperStyle = computed((): CSSProperties => {
        return {
          height: `calc(100% - ${unref(getIsShowLogo) ? '48px' : '0px'})`,
        };
      });

      /**
       * before click menu
       * @param menu
       */
      async function beforeMenuClickFn(path: string) {
        if (!isUrl(path)) {
          return true;
        }
        openWindow(path);
        return false;
      }
      /**
       * @description 路由跳转
       */
      function handleMenuClick(path: string) {
        go(path);
      }

      const { menusRef } = useSplitMenu(toRef(props, 'splitType'));
      const getCommonProps = computed(() => {
        const menus = unref(menusRef);
        return {
          menus,
          beforeClickFn: beforeMenuClickFn,
          items: menus, //菜单
          theme: unref(getComputedMenuTheme), //菜单主题
          accordion: unref(getAccordion), // 是否开启手风琴
          collapse: unref(getCollapsed), // 是否折叠
          collapsedShowTitle: unref(getCollapsedShowTitle), // 折叠是否显示标题
          onMenuClick: handleMenuClick,
        };
      });

      function renderMenu() {
        const { menus, ...menuProps } = unref(getCommonProps);
        if (!menus || !menus.length) return null;
        return !props.isHorizontal ? (
          <SimpleMenu {...menuProps} isSplitMenu={unref(getSplit)} items={menus} />
        ) : (
          <BasicMenu
            {...(menuProps as any)}
            isHorizontal={props.isHorizontal}
            type={unref(getMenuType)}
            showLogo={unref(getIsShowLogo)}
            mode={unref(getComputedMenuMode as any)}
            items={menus}
          />
        );
      }

      return () => {
        return (
          <>
            {renderHeader()}
            {unref(getUseScroll) ? (
              <ScrollContainer style={unref(getWrapperStyle)}>{renderMenu()}</ScrollContainer>
            ) : (
              renderMenu()
            )}
          </>
        );
      };
    },
  });
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-layout-menu';
  @logo-prefix-cls: ~'@{namespace}-app-logo';

  .@{prefix-cls} {
    // 菜单内logo样式
    &-logo {
      height: @header-height;
      padding: 10px 4px 10px 10px;

      img {
        width: @logo-width;
        height: @logo-width;
      }
    }

    &--mobile {
      .@{logo-prefix-cls} {
        &__title {
          opacity: 100%;
        }
      }
    }
  }
</style>
