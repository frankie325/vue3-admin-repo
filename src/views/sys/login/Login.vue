<template>
  <div class="relative w-full h-full px-4">
    <AppLocalePicker
      class="absolute text-black top-4 right-4 enter-x xl:text-gray-600"
    ></AppLocalePicker>
  </div>
</template>

<script setup lang="ts">
  import { AppLocalePicker } from '@/components/Application';
</script>
