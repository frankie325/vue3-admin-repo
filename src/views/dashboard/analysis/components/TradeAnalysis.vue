<template>
  <a-card title="交易统计" :loading="loading">
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
            type: 'cross',
            label: {
              backgroundColor: '#6a7985',
            },
          },
        },
        legend: {
          data: ['电子产品', '服饰', '食品'],
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
            boundaryGap: false,
            data: ['2016', '2017', '2018', '2019', '2020', '2021', '2022'],
          },
        ],
        yAxis: [
          {
            name: '万元',
            type: 'value',
          },
        ],
        series: [
          {
            name: '电子产品',
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: [120, 132, 101, 134, 90, 230, 210],
          },
          {
            name: '服饰',
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: [220, 182, 191, 234, 290, 330, 310],
          },
          {
            name: '食品',
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: [264, 248, 325, 200, 156, 105, 203],
          },
        ],
      });
    },
    // {
    //   immediate: true,
    // },
  );
</script>
