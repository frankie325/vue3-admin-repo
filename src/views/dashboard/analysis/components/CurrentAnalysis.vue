<template>
  <a-card title="实时交易" :loading="loading">
    <div ref="chartRef" class="w-full h-80"></div>
  </a-card>
</template>
<script lang="ts" setup>
  import { ref, Ref, watch, onUnmounted } from 'vue';
  import { useECharts } from '@/hooks/web/useECharts';
  import { setTimeout } from 'timers/promises';

  const chartRef = ref<HTMLElement | null>(null);
  const { setOptions, getInstance } = useECharts(chartRef as Ref<HTMLElement>);

  const props = defineProps({
    loading: Boolean,
  });

  let data: number[] = [];
  for (let i = 0; i < 3; ++i) {
    data.push(Math.round(Math.random() * 200));
  }

  function run() {
    for (let i = 0; i < data.length; ++i) {
      if (Math.random() > 0.9) {
        data[i] += Math.round(Math.random() * 2000);
      } else {
        data[i] += Math.round(Math.random() * 200);
      }
    }
  }
  let timerId: NodeJS.Timer;

  function interval() {
    run();
    getInstance()?.setOption({
      series: [
        {
          type: 'bar',
          data,
        },
      ],
    });
  }

  watch(
    () => props.loading,
    () => {
      if (props.loading) {
        return;
      }
      setOptions({
        grid: {
          left: 60,
        },
        xAxis: {
          max: 'dataMax',
          name: '元',
        },
        yAxis: {
          type: 'category',
          data: ['电子产品', '服饰', '食品'],
          inverse: true,
          animationDuration: 300,
          animationDurationUpdate: 300,
          max: 2, // only the largest 3 bars will be displayed
        },
        series: [
          {
            realtimeSort: true,
            type: 'bar',
            data: data,
            label: {
              show: true,
              position: 'right',
              valueAnimation: true,
            },
          },
        ],
        legend: {
          show: true,
        },
        animationDuration: 0,
        animationDurationUpdate: 3000,
        animationEasing: 'linear',
        animationEasingUpdate: 'linear',
      });

      timerId = setInterval(interval, 3000);
    },
  );

  onUnmounted(() => {
    clearInterval(timerId);
  });
</script>
