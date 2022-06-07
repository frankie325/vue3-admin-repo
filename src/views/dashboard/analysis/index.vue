<template>
  <div class="p-4">
    <GrowCard class="enter-y"></GrowCard>
    <VisitAnalysis class="!my-4 enter-y" :loading="loading" />
    <div class="md:flex enter-y">
      <TradeAnalysis class="!mr-4 md:w-1/3 w-full" :loading="loading" />
      <ProportionAnalysis class="!mr-4 md:w-1/3 w-full" :loading="loading" />
      <CurrentAnalysis class="md:w-1/3 w-full" :loading="loading" />
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import GrowCard from './components/GrowCard.vue';
  import VisitAnalysis from './components/VisitAnalysis.vue';
  import TradeAnalysis from './components/TradeAnalysis.vue';
  import ProportionAnalysis from './components/ProportionAnalysis.vue';
  import CurrentAnalysis from './components/CurrentAnalysis.vue';
  export default defineComponent({
    components: {
      GrowCard,
      VisitAnalysis,
      TradeAnalysis,
      ProportionAnalysis,
      CurrentAnalysis,
    },
    setup() {
      const loading = ref(true);

      setTimeout(() => {
        loading.value = false;
      }, 1500);

      return {
        loading,
      };
    },
  });
</script>

<style lang="less">
  .analysis {
    height: 2000px;
  }
</style>
