import { useI18n } from '@/hooks/web/useI18n';
import {
  MenuModeEnum,
  MenuTypeEnum,
  TopMenuAlignEnum,
  TriggerEnum,
  MixSidebarTriggerEnum,
} from '@/enums/menuEnum';

const { t } = useI18n();

// 菜单模式
export const menuTypeList = [
  {
    title: t('layout.setting.menuTypeSidebar'),
    mode: MenuModeEnum.INLINE,
    type: MenuTypeEnum.SIDEBAR,
  },
  {
    title: t('layout.setting.menuTypeMix'),
    mode: MenuModeEnum.INLINE,
    type: MenuTypeEnum.MIX,
  },

  {
    title: t('layout.setting.menuTypeTopMenu'),
    mode: MenuModeEnum.HORIZONTAL,
    type: MenuTypeEnum.TOP_MENU,
  },
  {
    title: t('layout.setting.menuTypeMixSidebar'),
    mode: MenuModeEnum.INLINE,
    type: MenuTypeEnum.MIX_SIDEBAR,
  },
];
