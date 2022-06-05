import { VNode, defineComponent } from 'vue';
import type { LoadingProps } from './typing';

import { createVNode, render, reactive, h } from 'vue';
import Loading from './Loading.vue';

export function createLoading(props?: Partial<LoadingProps>, target?: HTMLElement, wait = false) {
  let vm: Nullable<VNode> = null;

  const data = reactive({
    tip: '',
    loading: true,
    ...props,
  });

  // 创建Loading组件VNode
  const LoadingWrap = defineComponent({
    render() {
      return h(Loading, { ...data });
    },
  });

  vm = createVNode(LoadingWrap);

  // 调用render进入patch创建DOM元素
  if (wait) {
    // TODO fix https://github.com/anncwb/vue-vben-admin/issues/438
    setTimeout(() => {
      render(vm, document.createElement('div'));
    }, 0);
  } else {
    render(vm, document.createElement('div'));
  }

  // 将Loading组件添加到目标DOM中
  function open(target: HTMLElement = document.body) {
    if (!vm || !vm.el) {
      return;
    }
    target.appendChild(vm.el as HTMLElement);
  }

  // 移除Loading组件
  function close() {
    if (vm?.el && vm.el.parentNode) {
      vm.el.parentNode.removeChild(vm.el);
    }
  }

  if (target) {
    open(target);
  }

  return {
    vm,
    close,
    open,
    setTip: (tip: string) => {
      data.tip = tip;
    },
    setLoading: (loading: boolean) => {
      data.loading = loading;
    },
    get loading() {
      return data.loading;
    },
    get $el() {
      return vm?.el as HTMLElement;
    },
  };
}
