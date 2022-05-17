<template>
  <a-dropdown :trigger="['click']">
    <a class="ant-dropdown-link" @click.prevent>
      文
      <CaretDownOutlined />
    </a>
    <template #overlay>
      <a-menu :selectedKeys="selectedKeys" @click="handleMenuClick">
        <a-menu-item v-for="item in localeList" :key="item.value">
          <a href="javascript:;">{{ item.name }}</a>
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>
<script setup lang="ts">
  import type { MenuProps } from 'ant-design-vue';
  import { ref, watchEffect, unref } from 'vue';

  import { CaretDownOutlined } from '@ant-design/icons-vue';
  import { localeList } from '@/settings/localeSetting';
  import { useLocale } from '@/locales/useLocale';
  import { LocaleType } from '#/config';

  const selectedKeys = ref<string[]>([]);

  const { changeLocale, getLocale } = useLocale();

  // 监听当前语言环境变化，更新选项值
  watchEffect(() => {
    selectedKeys.value = [unref(getLocale)];
  });

  // 切换语言
  const handleMenuClick: MenuProps['onClick'] = (menu) => {
    if (menu.key === unref(getLocale)) {
      return;
    }
    changeLocale(menu.key as LocaleType);
  };
</script>
