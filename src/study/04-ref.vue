<template>
    <div ref="root">
        <a-input v-model:value="text" />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, unref, toRef, toRefs, isRef, customRef, shallowRef, onMounted } from "vue";

// defineComponent最主要的功能是为了 ts 下的类型推导
export default defineComponent({
    setup(props, context) {
        // 响应式api：

        // *****1.ref*****
        // ref我们用来将基本数据类型定义为响应式数据（实际上会转换为ref(xx) => reactive({value:xx})）
        const count = ref(0);
        count.value++;
        // console.log(count.value); // 1

        const foo = ref<string | number>("foo"); //使用泛型
        foo.value = "123";

        // *****2.unref*****
        // 返回原始类型，这是 val = isRef(val) ? val.value : val 的语法糖函数。
        const a = ref(0);
        const origin = unref(a);
        // console.log(a) // 为代理对象
        // console.log(origin) //原始数据

        // *****3.toRef*****
        // 为原响应式对象的某个属性创建一个ref，ref 可以被传递，它会保持对其源属性的响应式连接
        const state1 = reactive({
            foo: 1,
            bar: 2,
        });

        const fooRef = toRef(state1, "foo");
        // console.log(fooRef.value);
        fooRef.value++; //原响应式对象也会改变
        // console.log(state.foo); //2

        state1.foo++;
        // console.log(fooRef.value); //3

        // *****4.toRefs*****
        // 将响应式对象转为普通对象，该普通对象的每个属性都经过ref处理，链接到原响应式对象
        const state2 = reactive({
            foo: 1,
            bar: 2,
        });

        const state2Refs = toRefs(state2);

        state2.foo++;
        // console.log(state2Refs.foo.value); //2

        state2Refs.foo.value++;
        // console.log(state2.foo); //3

        // 使用解构时非常有用（如果直接解构会丢失响应式）
        const state3 = reactive({
            foo: 1,
            bar: 2,
        });
        let { bar } = toRefs(state3);
        bar.value++;
        // console.log(state3.bar); //3

        // *****5.isRef*****
        // 检查值是否为一个 ref 对象
        // console.log(isRef(count)); //true

        // *****6.customRef*****
        //创建一个自定义的 ref，它需要一个工厂函数，该函数接收 track 和 trigger 函数作为参数，并且应该返回一个带有 get 和 set 的对象
        function useDebouncedRef(value: string, delay: number = 200) {
            let timeout: number;
            return customRef<string>((track, trigger) => {
                return {
                    get() {
                        track();
                        return value;
                    },
                    set(newValue) {
                        // 如果重复输入，则一直不会执行，等待延迟完后重新赋值
                        clearTimeout(timeout);
                        timeout = window.setTimeout(() => {
                            value = newValue;
                            trigger();
                        }, delay);
                    },
                };
            });
        }

        // *****6.shallowRef*****

        // 如果使用ref处理对象，对象里面的属性也会经过reactive进行代理
        const c = ref({
            count: 1,
            nested: {
                name: "kfg",
            },
        });
        // console.log(c.value); //代理过的对象

        // 使用shallowRef，对象里面的属性则不会经过reactive进行代理
        const d = shallowRef({
            count: 1,
        });

        // console.log(d.value); //原始对象

        // *****7.模板引用*****
        /*
        创建一个ref ，将其以root属性名暴露在组件实例上，在patch过程中，如果标签上的ref属性名称
        和暴露在组件上的ref属性名称相同，就会把DOM元素分配给 ref的值
        */
        const root = ref(null);

        onMounted(() => {
            // DOM 元素将在初始渲染后分配给 ref
            // value就是DOM元素
            // console.log(root.value);
        });

        return {
            root,
            text: useDebouncedRef("hello"),
        };
    },
    data() {
        return {};
    },
});
</script>
