<template>
  <a-dropdown :trigger="['click']">
    <span class="cursor-pointer flex items-center">
      <Icon icon="ion:language" />
      <span v-if="showText" class="ml-1">{{ getLocaleText }}</span>
    </span>
    <template #overlay>
      <a-menu :selectedKeys="selectedKeys" @click="handleMenuClick">
        <a-menu-item v-for="item in localeList" :key="item.event">
          <a href="javascript:;">{{ item.text }}</a>
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>
<script setup lang="ts">
  import type { MenuProps } from 'ant-design-vue';
  import { ref, watchEffect, unref, computed } from 'vue';
  import { Icon } from '@/components/Icon';

  import { localeList } from '@/settings/localeSetting';
  import { useLocale } from '@/locales/useLocale';
  import { LocaleType } from '#/config';

  const props = defineProps({
    //  是否显示文字
    showText: { type: Boolean, default: true },
    // 切换语言时是否刷新页面
    reload: { type: Boolean },
  });
  const selectedKeys = ref<string[]>([]);

  const { changeLocale, getLocale } = useLocale();

  const getLocaleText = computed(() => {
    const key = selectedKeys.value[0];
    if (!key) {
      return '';
    }
    return localeList.find((item) => item.event === key)?.text;
  });

  // 监听当前语言环境变化，更新选项值
  watchEffect(() => {
    selectedKeys.value = [unref(getLocale)];
  });

  async function toggleLocale(lang: LocaleType | string) {
    await changeLocale(lang as LocaleType);
    selectedKeys.value = [lang as string];
    props.reload && location.reload();
  }

  // 切换语言
  const handleMenuClick: MenuProps['onClick'] = (menu) => {
    if (menu.key === unref(getLocale)) {
      return;
    }
    toggleLocale(menu.key as LocaleType);
  };
</script>
