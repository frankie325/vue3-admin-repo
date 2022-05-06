<template>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, readonly, isProxy, isReactive, isReadonly, toRaw, markRaw, shallowReactive, shallowReadonly } from "vue";

// defineComponent最主要的功能是为了 ts 下的类型推导
export default defineComponent({
    setup(props, context) {
        // 响应式api：

        // *****1.ref，reactive*****
        // ref我们用来将基本数据类型定义为响应式数据（实际上会转换为ref(xx) => reactive({value:xx})）
        const count = ref(1);

        // console.log(count);
        // reactive用来将引用类型定义为响应式数据
        const obj = reactive({ count });

        // reactive 将解包所有深层的 refs，同时维持 ref 的响应性
        obj.count === count.value;
        // console.log(obj.count === count.value); //true

        // 修改时，同步修改
        count.value++;
        // console.log(count.value); //2
        // console.log(obj.count); //2

        obj.count++;
        // console.log(count.value); //3
        // console.log(obj.count); //3

        // *****2.readonly*****
        const original1 = reactive({ msg: "msg" });
        // 接受一个对象 (响应式或纯对象) 或 ref，返回该对象的只读代理
        const copy1 = readonly(original1);
        // console.log(copy1) //返回一个只读的proxy实例
        // copy1.msg = "new msg"; // 控制台警告!

        const copy2 = readonly({ msg: "msg" }); // 纯对象
        // copy2.msg = "new msg"; // 控制台警告!

        const msg = ref("msg"); // ref
        let copy3 = readonly({ msg });
        // copy3.msg = "new msg"; // 控制台警告!

        // *****3.isProxy*****
        // 检查对象是否是由 reactive 或 readonly 创建的 proxy
        // console.log(isProxy(original1)); //true
        // console.log(isProxy(copy1)); //true
        // console.log(isProxy(msg)); //false

        // *****4.isReactive*****
        // 检查对象是否是由 reactive 创建的响应式代理
        // console.log(isReactive(original1)); //true
        // console.log(isReactive(copy1)); //true  如果该代理是 readonly 创建的，但包裹了由 reactive 创建的另一个代理，它也会返回 true

        // *****5.isReadonly*****
        // 检查对象是否是由 readonly 创建的只读代理
        // console.log(isReadonly(original1)); //false
        // console.log(isReadonly(copy1)); //true

        // *****6.toRaw*****
        // 返回 reactive 或 readonly 代理的原始对象
        const foo = {};
        const reactiveFoo = reactive(foo);
        const bar = "bar";
        const reactiveBar = ref(bar);
        // console.log(toRaw(reactiveFoo) === foo); // true
        // console.log(toRaw(reactiveBar) === bar); // false

        // *****7.markRaw*****
        // 标记一个对象，使其永远不会转换为 proxy。返回对象本身
        const a = markRaw({});
        // console.log(isReactive(reactive(a))); // false

        // 即使嵌套在其他对象中，也不会对其进行代理
        const b = reactive({ a });
        // console.log(isReactive(b.a)); // false

        // 嵌套在内的对象不会被标记
        const c = markRaw({
            nested: {},
        });
        const d = reactive({
            nested: c.nested,
        });
        // 虽然 `c` 被标记为原始，但 d.nested 不是。
        // console.log(c.nested === d.nested); // false

        // *****8.shallowReactive*****
        // 浅响应式：不执行嵌套对象的深层响应式，会暴露原始值
        const state1 = shallowReactive({
            foo: 1,
            nested: {
                bar: 2,
            },
            count: ref(0),
        });

        // console.log(isReactive(state1.nested)); //false
        // console.log(state1.count.value); //与 reactive 不同，任何使用 ref 的 属性，访问时不会自动解包，需要.value才能访问

        // *****8.shallowReadonly*****
        // 不执行嵌套对象的深度只读转换，会暴露原始值
        const state2 = shallowReadonly({
            foo: 1,
            nested: {
                bar: 2,
            },
            count: ref(0),
        });
        // console.log(isReadonly(state2.nested)); //false
        // console.log(state1.count.value); //与 readonly 不同，任何使用 ref 的 属性，访问时不会自动解包，需要.value才能访问
    },
    data() {
        return {};
    },
});
</script>
