import { defineComponent, unref, computed } from 'vue';

import { AppDarkModeToggle } from '@/components/Application';
import { TypePicker } from './components';
import { useI18n } from '@/hooks/web/useI18n';
import { useRootSetting } from '@/hooks/setting/useRootSetting';

import { menuTypeList } from './enum';

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

    const { getShowDarkModeToggle } = useRootSetting();

    function renderSidebar() {
      // return <TypePicker menuTypeList={menuTypeList} />;
    }

    return () => (
      <a-drawer v-model:visible={showDrawer.value} title="项目配置">
        {unref(getShowDarkModeToggle) && <a-divider>{t('layout.setting.darkMode')}</a-divider>}
        {unref(getShowDarkModeToggle) && <AppDarkModeToggle class="mx-auto" />}
        <a-divider>{t('layout.setting.navMode')}</a-divider>
        {renderSidebar()}
      </a-drawer>
    );
  },
});
