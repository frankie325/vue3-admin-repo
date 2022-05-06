<template>
    <div>
        <a-button type="primary" @click="handleClick">点击</a-button>
        <a-button type="primary" @click="handleCheck">校验</a-button>
    </div>
</template>

<script lang="ts">
import { ref, reactive, defineComponent } from "vue";

// Vue3新增的一些选项：
export default defineComponent({
    // 1.新增emits选项：
    // Vue3移除了.native修饰符，在组件标签上绑定的事件将默认绑定到根标签
    // 如果在中emits设置了，则不会添加到根标签，通过$emit触发书剑，建议使用 emits 选项记录自定义组件绑定的事件
    // emits 选项中列出的事件也将从 $attrs 属性中移除
    // emits: ["click", "check"],  //数组语法

    // 对象语法
    emits: {
        click: null,

        // 可以设置校验函数，参数为$emit调用时传递的参数
        check: function (arg: number) {
            if (typeof arg === "number") {
                return true;
            }

            // 返回布尔值，以表示事件参数是否有效，如果返回false,会在控制台警告
            return false;
        },
    },
    // 2.新增expose选项：
    // 通过 $refs、$parent 或 $root访问组件实例时，设置暴露出去的子组件实例属性
    // 不设置则都能访问
    // expose: ["handleClick", "msg", "$attrs"],
    data() {
        return {
            msg: "hello data",
        };
    },
    methods: {
        handleClick() {
            this.$emit("click");
        },
        handleCheck() {
            this.$emit("check", 1);
        },
    },
    mounted() {
        // console.log(this);
    },
});
</script>
