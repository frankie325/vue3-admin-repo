<template>
    <div>
        <div>StudyWatchEffect</div>
        <a-button type="primary" @click="clickButton">Primary Button</a-button>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, watchEffect, watchPostEffect, watchSyncEffect } from "vue";

export default defineComponent({
    setup(props, context) {
        // 响应式api：

        // *****1.watchEffect*****
        const count = ref(1);

        // 立即执行传入的一个函数，同时响应式追踪其依赖，并在其依赖变更时重新运行该函数
        // 对于Vue来说更新视图层才是主作用，副作用主要有：DOM更新、watchEffect、watch、computed、、、、
        const stop = watchEffect(() => {
            // count.value++; // 不会引起无限循环
            // console.log(count.value);
        });
        // 侦听器会被链接到组件的生命周期，当组件卸载时，会自动卸载该侦听
        // stop()  //也可以手动调用停止侦听

        // 1秒之后，count变化，重新运行watchEffect传入的函数
        setTimeout(() => {
            count.value++;
        }, 1000);

        // ***清除副作用：***
        // 有时我们会在里面执行异步操作
        const list = ref({});

        watchEffect(async (onInvalidate) => {
            // 如果依赖的变量，不断变化，就会不断发送请求出去
            // const token = performAsyncOperation(id.value)

            //我们可以用接收的 onInvalidate 函数注册一个回调
            // - 即将重新执行时触发（即第一次创建时不会执行）
            // - 侦听器被停止时
            onInvalidate(() => {
                // 取消请求的发送，来消除副作用
                // token.cancel();
            });

            // console.log(list.value);
        });

        setTimeout(() => {
            list.value = {
                name: "kfg",
            };
        }, 1000);

        // ***副作用执行时机：***
        // Vue 的响应性系统会缓存副作用函数，并异步地刷新它
        const a = ref(1);

        // 默认第一次执行时是同步的，创建时便会执行副作用函数
        // 当依赖变量更新时，会异步刷新，会在所有的组件 update 前执行
        watchEffect(() => {
            // debugger
            // console.log(a.value);
        });

        watchEffect(
            () => {
                // debugger;
                // console.log(a.value);
            },
            {
                // 可以传递带有 flush 选项的附加选项 (默认为 'pre')
                // 在组件更新后触发，这样你就可以访问更新的 DOM。
                // 注意：这也将推迟副作用的初始运行，直到组件的首次渲染完成。
                flush: "post",

                // 强制为同步触发，然而，这是低效的，应该很少需要
                //  flush: 'sync'


                // 开发时调试
                // 响应式数据作为依赖项被追踪时调用
                onTrack(e) {
                    // debugger;
                },
                // 依赖项变更导致副作用被触发时被调用
                onTrigger(e) {
                    // debugger;
                },
            }
        );

        // *****2.watchPostEffect*****
        // watchEffect 的别名，带有 flush: 'post' 选项
        // watchPostEffect();

        // *****3.watchSyncEffect*****
        // watchEffect 的别名，带有 flush: 'sync' 选项
        // watchSyncEffect();
        return {
            a,
        };
    },
    methods: {
        clickButton() {
            this.a++;
            // this.list.value = {
            //     name: "kfg",
            // };
        },
    },
    mounted() {},
});
</script>
