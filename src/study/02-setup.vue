<template>
    <div>
        <div>StudySetup</div>
        <!-- <div>{{ msg }}</div>
        <div>{{ count }}</div>
        <div>{{ object.foo }}</div> -->
        <div>x：{{ userLocation.longitude }} y：{{ userLocation.latitude }}</div>
        <div>pro:{{ pro }}</div>
    </div>
</template>

<script lang="ts">
import { ref, reactive, defineComponent, onMounted, inject, h } from "vue";

// defineComponent最主要的功能是为了 ts 下的类型推导
export default defineComponent({
    props: {
        title: String,
    },
    // setup 函数是一个新的组件选项。它是组件内部使用组合式 API 的入口点
    // 在初始 prop 解析之后立即调用 setup。在生命周期方面，它是在 beforeCreate 钩子之前调用的
    setup(props, context) {
        // 接收props作为第一个参数
        // console.log(props.title);

        // props.title = "str"; //发出警告，只读，无法修改

        // 解构会失去响应性
        let { title } = props;
        // title = "str";

        const count = ref(0);
        const object = reactive({ foo: "bar" });

        // 第二个参数提供了一个上下文对象，context 是一个普通的 JavaScript 对象，
        // 也就是说，它不是响应式的，可以安全地使用 ES6 解构

        // Attribute (非响应式对象，等同于 $attrs)
        // console.log(context.attrs);
        // 插槽 (非响应式对象，等同于 $slots)
        // console.log(context.slots);
        // 触发事件 (方法，等同于 $emit)
        // console.log(context.emit);
        // 暴露公共 property (函数)
        // console.log(context.expose);

        // 1.setup返回数据时，可以在模板中直接访问，也会添加到当前组件实例上，所以也可以通过this直接访问
        // return {
        //     count, //会自动解包
        //     object,
        // };

        // 2.setup也可以返回一个渲染函数，会覆盖template里面的内容
        // return () => h("div", count.value);

        // 返回一个渲染函数将阻止我们返回任何其它的东西
        // 可以通过调用 expose 来解决这个问题，给它传递一个对象,其中定义的属性将可以被外部组件实例访问
        const increment = () => ++count.value;

        context.expose({
            increment,
        });

        // 3. 在setup内使用生命周期钩子
        onMounted(() => {
            // console.log("执行mounted钩子");
        });

        // 4. 在setup中使用provide和inject
        // 第一个参数：注入的属性名
        // 第二个参数：默认值（可选）
        const userLocation = inject("location", "The Universe");
        const pro = inject("pro");

        return {
            userLocation,
            pro,
        };
    },
    data() {
        return {
            msg: "Vue 3",
        };
    },
    mounted() {
        // console.log(this)
    },
});
</script>
