<template>
  <a-tooltip :title="getTitle" placement="bottom" :mouseEnterDelay="0.5">
    <span @click="toggle">
      <FullscreenOutlined v-if="!isFullscreen" />
      <FullscreenExitOutlined v-else />
    </span>
  </a-tooltip>
</template>
<script lang="ts">
  import { defineComponent, computed, unref } from 'vue';
  import { useFullscreen } from '@vueuse/core';
  import { useI18n } from '@/hooks/web/useI18n';

  import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons-vue';
  export default defineComponent({
    name: 'FullScreen',
    components: { FullscreenExitOutlined, FullscreenOutlined },

    setup() {
      const { t } = useI18n();
      const { toggle, isFullscreen } = useFullscreen();

      const getTitle = computed(() => {
        return unref(isFullscreen)
          ? t('layout.header.tooltipExitFull')
          : t('layout.header.tooltipEntryFull');
      });

      return {
        getTitle,
        isFullscreen,
        toggle,
      };
    },
  });
</script>
