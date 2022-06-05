<template>
  <div class="analysis">
    <a-input v-model:value="text"></a-input>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { onActivated, onDeactivated } from 'vue';

  export default defineComponent({
    setup() {
      const text = ref('');

      onActivated(() => {
        // 调用时机为首次挂载
        // 以及每次从缓存中被重新插入时
        console.log('active');
      });

      onDeactivated(() => {
        // 在从 DOM 上移除、进入缓存
        // 以及组件卸载时调用
        console.log('unActive');
      });
      return {
        text,
      };
    },
    updated() {
      console.log('updated');
    },
  });
</script>

<style lang="less">
  .analysis {
    height: 2000px;
  }
</style>
