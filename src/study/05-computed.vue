<template>
    <div>
        <div>StudyComputed</div>
        <div>{{ plusOne }}</div>
        <div>{{ plusOne }}</div>
        <div>{{ newMsg }}</div>
        <div>{{ newMsg }}</div>
        <a-button type="primary" @click="clickButton">Primary Button</a-button>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";

export default defineComponent({
    setup(props, context) {
        // 响应式api：

        // *****1.computed*****
        const count = ref(1);
        // 接受一个getter函数，根据getter的返回值，返回一个只读的ref对象
        const plusOne = computed<number>(() => count.value + 1);
        // console.log(plusOne.value); //2
        // plusOne.value++; //警告，是只读的，只有依赖变量count改变时，plusOne的值才会改变
        // console.log(plusOne);

        // 也可以传入一个具有get 和 set 函数的对象，用来创建可写的ref对象
        const msg = ref("msg");
        const newMsg = computed<string>(
            {
                get() {
                    return msg.value;
                },
                set(nv) {
                    msg.value = nv;
                },
            },
            // 也可以传入第二个选项，开发时可以用来调试
            {
                // get调用前触发
                onTrack(event) {
                    // debugger
                },
                // set调用后触发
                onTrigger(event) {
                    // debugger;
                },
            }
        );

        return {
            plusOne,
            count,
            msg,
            newMsg,
        };
    },
    data() {
        return {};
    },
    methods: {
        clickButton() {
            this.count++;
            this.newMsg = "new msg";
        },
    },
    mounted() {
        // console.log(this);
    },
});
</script>
