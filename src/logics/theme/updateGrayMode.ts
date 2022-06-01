import { toggleClass } from './util';

/**
 * @description 更新为灰色模式
 */
export function updateGrayMode(gray: boolean) {
  toggleClass(gray, 'gray-mode', document.documentElement);
}
