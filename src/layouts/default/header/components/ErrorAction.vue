<template>
  <div>
    <a-tooltip
      :title="t('layout.header.tooltipErrorLog')"
      placement="bottom"
      :mouseEnterDelay="0.5"
      @click="handleToErrorList"
    >
      <a-badge :count="getCount" :offset="[0, 10]" :overflowCount="99">
        <Icon icon="ion:bug-outline" />
      </a-badge>
    </a-tooltip>
  </div>
</template>
<script lang="ts">
  import { defineComponent, computed } from 'vue';
  import { useRouter } from 'vue-router';

  import Icon from '@/components/Icon';

  import { useI18n } from '@/hooks/web/useI18n';
  import { useErrorLogStore } from '@/store/modules/errorLog';
  import { PageEnum } from '@/enums/pageEnum';

  export default defineComponent({
    name: 'ErrorAction',
    components: { Icon },
    setup() {
      const { t } = useI18n();
      const { push } = useRouter();
      const errorLogStore = useErrorLogStore();

      const getCount = computed(() => errorLogStore.getErrorLogListCount);

      // 跳转错误收集页面，并重置错误条数
      function handleToErrorList() {
        push(PageEnum.ERROR_LOG_PAGE).then(() => {
          errorLogStore.setErrorLogListCount(0);
        });
      }

      return {
        getCount,
        t,
        handleToErrorList,
      };
    },
  });
</script>
