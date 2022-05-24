<template>
  <div v-if="getShowDarkModeToggle" :class="getClass">
    <a-switch
      :checked="getDarkMode"
      checkedValue="dark"
      unCheckedValue="light"
      @change="toggleDarkMode"
    ></a-switch>
  </div>
</template>
<script setup lang="ts">
  import { ref, computed, unref } from 'vue';
  import { useDesign } from '@/hooks/web/useDesign';

  import { updateDarkTheme } from '@/logics/theme/dark';
  import { useRootSetting } from '@/hooks/setting/useRootSetting';
  import { ThemeEnum } from '@/enums/appEnum';

  const { prefixCls } = useDesign('dark-switch');
  const { getDarkMode, setDarkMode, getShowDarkModeToggle } = useRootSetting();

  const isDark = computed(() => getDarkMode.value === ThemeEnum.DARK);
  const getClass = computed(() => [
    prefixCls,
    {
      [`${prefixCls}--dark`]: unref(isDark),
    },
  ]);

  // 切换黑暗模式
  function toggleDarkMode(mode: string) {
    const darkMode = mode === ThemeEnum.DARK ? ThemeEnum.DARK : ThemeEnum.LIGHT;
    setDarkMode(darkMode);
    updateDarkTheme(darkMode);
  }
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-dark-switch';

  .@{prefix-cls} {
    position: relative;
    display: flex;
    width: 50px;
  }
</style>
