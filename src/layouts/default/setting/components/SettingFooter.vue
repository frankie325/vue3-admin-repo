<template>
  <div :class="prefixCls">
    <a-button type="default" class="my-3" block @click="handleResetSetting">
      <RedoOutlined class="mr-2" />
      {{ t('common.resetText') }}
    </a-button>
    <a-button type="error" block @click="handleClearAndRedo">
      <RedoOutlined class="mr-2" />
      {{ t('layout.setting.clearBtn') }}
    </a-button>
  </div>
</template>
<script lang="ts">
  import { defineComponent, unref } from 'vue';
  import { RedoOutlined } from '@ant-design/icons-vue';
  import { useDesign } from '@/hooks/web/useDesign';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useAppStore } from '@/store/modules/app';
  import { usePermissionStore } from '@/store/modules/permission';
  import { useMultipleTabStore } from '@/store/modules/multipleTab';
  import { useUserStore } from '@/store/modules/user';

  import defaultSetting from '@/settings/projectSetting';
  import { updateColorWeak } from '@/logics/theme/updateColorWeak';
  import { updateGrayMode } from '@/logics/theme/updateGrayMode';

  export default defineComponent({
    name: 'SettingFooter',
    components: { RedoOutlined },
    setup() {
      const { prefixCls } = useDesign('setting-footer');
      const { t } = useI18n();
      const { createSuccessModal, createMessage } = useMessage();
      const appStore = useAppStore();
      const permissionStore = usePermissionStore();
      const tabStore = useMultipleTabStore();
      const userStore = useUserStore();

      function handleResetSetting() {
        try {
          appStore.setProjectConfig(defaultSetting);
          const { colorWeak, grayMode } = defaultSetting;
          updateColorWeak(colorWeak);
          updateGrayMode(grayMode);
          createMessage.success(t('layout.setting.resetSuccess'));
        } catch (error: any) {
          createMessage.error(error);
        }
      }
      function handleClearAndRedo() {
        localStorage.clear();
        sessionStorage.clear();
        appStore.resetAllState();
        permissionStore.resetState();
        tabStore.resetState();
        userStore.resetState();
        location.reload();
      }
      return {
        prefixCls,
        t,
        handleResetSetting,
        handleClearAndRedo,
      };
    },
  });
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-setting-footer';

  .@{prefix-cls} {
    display: flex;
    flex-direction: column;
    align-items: center;
    .btn-warning {
      background-color: @warning-color;
    }
  }
</style>
