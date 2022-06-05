import type { Directive, App } from 'vue';
import { createLoading } from '@/components/Loading';

/**
 * @description: v-loading指令
 */
const loadingDirective: Directive = {
  mounted(el, binding) {
    const tip = el.getAttribute('loading-tip'); // 作为Loading组件的props使用
    const background = el.getAttribute('loading-background');
    const size = el.getAttribute('loading-size');
    const fullscreen = !!binding.modifiers.fullscreen; //是否使用v-loading.fullscreen修饰符
    // 创建Loading组件，
    const instance = createLoading(
      {
        tip,
        background,
        size: size || 'large',
        loading: !!binding.value, //初始时是否开启loading动画
        absolute: !fullscreen,
      },
      fullscreen ? document.body : el,
    );
    el.instance = instance; // 用来操作Loading组件实例
  },
  // 组件更新和子组件更新完，更新loading状态
  updated(el, binding) {
    const instance = el.instance;
    if (!instance) return;
    instance.setTip(el.getAttribute('loading-tip'));
    if (binding.oldValue !== binding.value) {
      instance.setLoading?.(binding.value && !instance.loading);
    }
  },
  unmounted(el) {
    el?.instance?.close();
  },
};

export default loadingDirective;

export function setupLoadingDirective(app: App) {
  app.directive('loading', loadingDirective);
}
