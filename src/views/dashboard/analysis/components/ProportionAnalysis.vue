<template>
  <a-card title="产业占比" :loading="loading">
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
          trigger: 'item',
        },
        legend: {
          top: '5%',
          left: 'center',
        },
        series: [
          {
            name: '数量',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['50%', '60%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2,
            },
            label: {
              show: false,
              position: 'center',
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '30',
                fontWeight: 'bold',
              },
            },
            labelLine: {
              show: false,
            },
            data: [
              { value: 1048, name: '电子产品' },
              { value: 735, name: '服饰' },
              { value: 580, name: '食品' },
            ],
          },
        ],
      });
    },
  );
</script>
