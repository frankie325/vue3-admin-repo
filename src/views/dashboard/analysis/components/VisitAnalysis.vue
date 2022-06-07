<template>
  <a-card title="访问量" :loading="loading">
    <div ref="chartRef" class="w-full h-80"></div>
  </a-card>
</template>
<script lang="ts" setup>
  import { ref, Ref, watch } from 'vue';
  import { useECharts } from '@/hooks/web/useECharts';

  const chartRef = ref<HTMLElement | null>(null);
  const { setOptions } = useECharts(chartRef as Ref<HTMLElement>);

  const props = defineProps({
    loading: Boolean,
  });

  watch(
    () => props.loading,
    () => {
      if (props.loading) {
        return;
      }
      setOptions({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
        series: [
          {
            name: '访问量',
            type: 'bar',
            emphasis: {
              focus: 'series',
            },
            data: [320, 332, 301, 334, 390, 330, 320],
          },
        ],
      });
    },
    // {
    //   immediate: true,
    // },
  );
</script>
