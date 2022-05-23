import { computed, unref } from 'vue';

import { useAppStore } from '@/store/modules/app';

import { useRouter } from 'vue-router';

export const useFullContent = () => {
  const appStore = useAppStore();
  const router = useRouter();
  const { currentRoute } = router;

  // 是否全屏显示内容，不显示菜单
  const getFullContent = computed(() => {
    // Query parameters, the full screen is displayed when the address bar has a full parameter
    const route = unref(currentRoute);
    const query = route.query;
    if (query && Reflect.has(query, '__full__')) {
      return true;
    }
    return appStore.getProjectConfig.fullContent;
  });

  return { getFullContent };
};
