<template>
  <div class="md:flex">
    <template v-for="(item, index) in growCardList" :key="item.title">
      <a-card
        size="small"
        class="md:w-1/4 w-full md:!mt-0"
        :class="{ 'md:!mr-4': index + 1 < 4, '!mt-4': index > 0 }"
        :title="item.title"
      >
        <template #extra>
          <a-tag :color="item.color">{{ item.action }}</a-tag>
        </template>
        <div class="py-4 px-4 flex justify-between">
          <a-statistic prefix="$" :value="item.value" />
          <Icon :icon="item.icon" :size="40" />
        </div>
        <div class="py-4 px-4 flex justify-between items-center">
          <span>总{{ item.title }}</span>
          <a-statistic prefix="$" :value="item.total" />
        </div>
      </a-card>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { Icon } from '@/components/Icon';
  import { growCardList } from '../data';
</script>
