<template>
  <router-view>
    <template #default="{ Component, route }">
      <transition :name="transitionName" mode="out-in" appear>
        <keep-alive v-if="openCache" :include="getCaches">
          <component :is="Component" :key="route.fullPath" />
        </keep-alive>
        <component v-else :is="Component" :key="route.fullPath" />
      </transition>
    </template>
  </router-view>
  <FrameLayout v-if="getCanEmbedIFramePage" />
</template>

<script lang="ts">
  import { computed, defineComponent, unref } from 'vue';
  import { useRouter } from 'vue-router';

  import FrameLayout from '@/layouts/iframe/index.vue';

  import { useRootSetting } from '@/hooks/setting/useRootSetting';
  import { useMultipleTabSetting } from '@/hooks/setting/useMultipleTabSetting';
  import { useTransitionSetting } from '@/hooks/setting/useTransitionSetting';

  import { useMultipleTabStore } from '@/store/modules/multipleTab';
  export default defineComponent({
    name: 'PageLayout',
    components: { FrameLayout },
    setup() {
      const { getShowMultipleTab } = useMultipleTabSetting();
      const tabStore = useMultipleTabStore();

      const { getOpenKeepAlive, getCanEmbedIFramePage } = useRootSetting();

      const { getBasicTransition, getEnableTransition } = useTransitionSetting();

      // 是否开启KeepAlive缓存
      const openCache = computed(() => unref(getOpenKeepAlive) && unref(getShowMultipleTab));

      // 缓存的tabList
      const getCaches = computed((): string[] => {
        if (!unref(getOpenKeepAlive)) {
          return [];
        }
        return tabStore.getCachedTabList;
      });

      // 动画效果
      const transitionName = computed(() => {
        if (!getEnableTransition.value) return;
        const router = useRouter();
        const currentRoute = router.currentRoute.value;
        return (
          unref(getBasicTransition) || (currentRoute.meta?.transitionName as string) || 'fade-slide'
        );
      });

      return {
        openCache,
        getEnableTransition,
        getBasicTransition,
        getCaches,
        transitionName,
        getCanEmbedIFramePage,
      };
    },
  });
</script>
