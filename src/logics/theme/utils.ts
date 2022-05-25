const docEle = document.documentElement;

/**
 * @description: 设置css变量的值
 */
export function setCssVar(prop: string, val: any, dom = docEle) {
  dom.style.setProperty(prop, val);
}
