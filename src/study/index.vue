<template>
  <div>
    <StudyData ref="study-data" @click="clickData" @check="check" />
    <StudySetup ref="study-setup" :str="'string'" title="setup" />
    <StudyReactive />
    <StudyRef />
    <StudyComputed />
    <StudyWatchEffect />
    <StudyComposition :userId="userId" @click="userId = '1234567'" />
    <StudyScriptSetup ref="script-setup" :name="'kfg'" />
  </div>
</template>

<script lang="ts">
  import StudyData from './01-data.vue';
  import StudySetup from './02-setup.vue';
  import StudyReactive from './03-reactive.vue';
  import StudyRef from './04-ref.vue';
  import StudyComputed from './05-computed.vue';
  import StudyWatchEffect from './06-watchEffect.vue';
  import StudyComposition from './07-composition/index.vue';
  import StudyScriptSetup from './08-scriptSetup/index.vue';

  import { provide, readonly, ref } from 'vue';
  export default {
    components: {
      StudyData,
      StudySetup,
      StudyReactive,
      StudyRef,
      StudyComputed,
      StudyWatchEffect,
      StudyComposition,
      StudyScriptSetup,
    },
    setup() {
      // 在setup中使用provide和inject
      // 第一个参数：name<string>
      // 第二个参数：value
      provide('location', {
        longitude: 90,
        latitude: 135,
      });

      // 使用响应式的注入
      const pro = ref('注入的数据');
      provide('pro', pro);

      // 注入数据更新了，则使用了该数据的子组件也会更新
      // 建议尽可能将对响应式 property 的所有修改限制在定义 provide 的组件内部
      setTimeout(() => {
        pro.value = '新注入的数据';
      }, 1000);

      // 如果不想子组件修改注入的数据，可以使用readonly
      // provide("location", readonly({ name:"kfg" }));
    },
    data() {
      return {
        userId: '123456',
      };
    },
    mounted() {
      // console.log(this.$refs["study-data"]);
      // console.log(this.$refs["study-setup"]);
      // console.log(this.$refs["script-setup"]);
    },
    methods: {
      clickData() {
        console.log('触发点击');
        this.$refs['study-setup'].increment();
      },
      check() {
        console.log('触发组件自定义事件');
      },
    },
  };
</script>
