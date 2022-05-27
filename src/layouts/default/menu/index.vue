<script lang="tsx">
  import type { PropType, CSSProperties } from 'vue';
  import { computed, defineComponent, unref, toRef } from 'vue';

  import { AppLogo } from '@/components/Application';
  import { ScrollContainer } from '@/components/Container';

  import { useDesign } from '@/hooks/web/useDesign';
  import { useAppInject } from '@/hooks/web/useAppInject';
  import { useRootSetting } from '@/hooks/setting/useRootSetting';
  import { useMenuSetting } from '@/hooks/setting/useMenuSetting';
  import { propTypes } from '@/utils/propTypes';
  import { MenuModeEnum, MenuSplitTyeEnum } from '@/enums/menuEnum';

  export default defineComponent({
    name: 'LayoutMenu',
    props: {
      theme: propTypes.oneOf(['light', 'dark']),
      splitType: {
        type: Number as PropType<MenuSplitTyeEnum>,
        default: MenuSplitTyeEnum.NONE,
      },
      isHorizontal: propTypes.bool,
      // menu Mode
      menuMode: {
        type: [String] as PropType<Nullable<MenuModeEnum>>,
        default: '',
      },
    },
    setup(props) {
      const { getShowLogo } = useRootSetting();
      const { prefixCls } = useDesign('layout-menu');

      const { getIsMobile } = useAppInject();

      const { getCollapsed, getIsSidebarType, getMenuTheme, getIsHorizontal } = useMenuSetting();

      // 只有左侧菜单模式需要展示菜单内的logo
      const getIsShowLogo = computed(() => unref(getShowLogo) && unref(getIsSidebarType));

      // 菜单主题
      const getComputedMenuTheme = computed(() => props.theme || unref(getMenuTheme));

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

      function renderMenu() {}

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
