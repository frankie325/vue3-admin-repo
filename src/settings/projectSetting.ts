import type { ProjectConfig } from '#/config';
import { CacheTypeEnum } from '@/enums/cacheEnum';
import { SessionTimeoutProcessingEnum } from '@/enums/appEnum';

const setting: ProjectConfig = {
  showSettingButton: true,

  showDarkModeToggle: true,

  useErrorHandle: true,

  menuSetting: {},

  permissionCacheType: CacheTypeEnum.LOCAL,

  sessionTimeoutProcessing: SessionTimeoutProcessingEnum.ROUTE_JUMP,
};

export default setting;
