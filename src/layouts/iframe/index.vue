<template>
  <div v-if="showFrame">
    <template v-for="frame in getFramePages" :key="frame.path">
      <FramePage
        v-if="frame.meta.frameSrc && hasRenderFrame(frame.name)"
        v-show="showIframe(frame)"
        :frameSrc="frame.meta.frameSrc"
      />
    </template>
  </div>
</template>

<script lang="ts">
  import { defineComponent, unref, computed } from 'vue';
  import FramePage from '@/views/sys/iframe/index.vue';

  import { useFrameKeepAlive } from './useFrameKeepAlive';

  export default defineComponent({
    name: 'FrameLayout',
    components: { FramePage },

    setup() {
      /**
       * 一次渲染所有具有meta.frameSrc的路由，然后通过v-show控制iframe的显隐
       */
      const { getFramePages, hasRenderFrame, showIframe } = useFrameKeepAlive();

      const showFrame = computed(() => unref(getFramePages).length > 0);

      return {
        showFrame,
        getFramePages,
        hasRenderFrame,
        showIframe,
      };
    },
  });
</script>
