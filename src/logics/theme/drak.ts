import { hasClass, addClass, removeClass } from '@/utils/domUtils';

/**
 * @description: 主题切换时，更新html标签上的属性
 */
export async function updateDarkTheme(mode: string | null = 'light') {
  const htmlRoot = document.getElementById('htmlRoot');
  if (!htmlRoot) return;

  const hasDarkClass = hasClass(htmlRoot, 'dark');

  if (mode === 'dark') {
    if (import.meta.env.PROD) {
    }

    htmlRoot.setAttribute('data-theme', 'dark');
    if (!hasDarkClass) {
      addClass(htmlRoot, 'dark');
    }
  } else {
    htmlRoot.setAttribute('data-theme', 'light');
    if (hasDarkClass) {
      removeClass(htmlRoot, 'dark');
    }
  }
}
