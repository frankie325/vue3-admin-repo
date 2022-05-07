<template>
  <div>
    <div>StudyWatchScriptSetup</div>
    <div>{{ str }}</div>
    <div @click="log">{{ msg }}</div>
    <div @click="count++">{{ count }}</div>
    <MyComponent />
    <Form.Foo />
    <Form.Bar />
  </div>
</template>

<script lang="ts" setup>
  import { ref, useSlots, useAttrs } from 'vue';
  /*
<script setup>是setup选项的语法糖：

里面的代码会被编译成组件 setup() 函数的内容，这意味着与普通的  <script> 只在组件被首次引入的时候执行一次不同，
<script setup> 中的代码会在每次组件实例被创建的时候执行


*/

  // 1. 声明的顶层变量（变量，函数声明，以及 import 引入的内容），都会直接暴露给组件实例
  const msg = 'Hello Vue3';

  function log() {
    console.log(msg);
  }

  // 2. 响应式状态
  const count = ref(0);

  // 3. 引入的自定义组件也能在模板直接使用
  import MyComponent from './MyComponent.vue';

  // 4. 命名空间组件，需要从单个文件中导入多个组件的时候非常有用
  import Form from './Form';

  // 5. 可以使用defineProps和defineEmits来声明props 和 emits选项，无需导入直接可用，它们具备完整的类型推断
  // const props = defineProps({
  //     name: String,
  // });

  const emit = defineEmits(['change', 'delete']);

  // 如果开启了TypeScript功能，可以使用纯类型语法做校验
  // const props = defineProps<{
  //     foo: string;
  //     bar?: number;
  // }>();

  // 使用类型声明时不能设置默认的props值，提供了withDefaults设置默认值
  interface Props {
    msg?: string;
    labels?: string[];
  }

  const props = withDefaults(defineProps<Props>(), {
    msg: 'hello',
    labels: () => ['one', 'two'],
  });

  // defineProps和defineEmits传入的选项，不能包含setup范围中声明的变量，会引起编译错误
  // const c = "change"
  // const emit = defineEmits([c, "delete"]);

  // 6. 使用$refs等方式访问组件实例时，不会暴露任何在 <script setup> 中声明的绑定，可以使用defineExpose进行暴露
  defineExpose({
    msg,
  });

  // 7. useSlots 和 useAttrs获取组件的slots 和 attrs，需要引入
  // 在 <script setup> 使用 slots 和 attrs 的情况应该是很罕见的，因为可以在模板中通过 $slots 和 $attrs 来访问它们
  const slots = useSlots();
  const attrs = useAttrs();
  // console.log(slots);
  // console.log(attrs);

  // 8. 可以使用顶层await，代码会被编译成 async setup()
  // const post = await fetch(`/api/post/1`).then(r
</script>

<script lang="ts">
  // 8. 与普通的 <script> 一起使用
  import { defineComponent } from 'vue';

  export default defineComponent({
    // 使用了script setup，则普通script里的setup不会生效
    // setup(props) {
    //     const str = ref("i am string");

    //     return {
    //         str,
    //     };
    // },
    // 因为使用了script setup，所以普通script标签内的属性也不会暴露到组件实例上，需要配置expose选项
    expose: ['str'],
    data() {
      return {
        str: 'i am string',
      };
    },
    methods: {},
  });
</script>
