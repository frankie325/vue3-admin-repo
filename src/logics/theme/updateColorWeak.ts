import { toggleClass } from './util';

/**
 * @description 更新为色弱模式
 */
export function updateColorWeak(colorWeak: boolean) {
  toggleClass(colorWeak, 'color-weak', document.documentElement);
}
