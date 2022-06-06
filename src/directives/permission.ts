import type { App, Directive, DirectiveBinding } from 'vue';
import { usePermission } from '@/hooks/web/usePermission';

function isAuth(el: Element, binding: any) {
  const { hasPermission } = usePermission();
  const value = binding.value;
  if (!value) return;
  if (!hasPermission(value)) {
    // 不符合权限，则直接从父节点移除
    el.parentNode?.removeChild(el);
  }
}

// v-auth指令
const authDirective: Directive = {
  mounted: (el: Element, binding: DirectiveBinding<any>) => {
    isAuth(el, binding);
  },
};

export function setupPermissionDirective(app: App) {
  app.directive('auth', authDirective);
}

export default authDirective;
