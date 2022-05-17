function trim(string: string) {
  return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '');
}
/**
 * @description: 判断DOM元素是否存在指定类名
 */
export function hasClass(el: Element, cls: string) {
  if (!el || !cls) return false;
  if (cls.indexOf(' ') !== -1) throw new Error('className should not contain space.');
  if (el.classList) {
    return el.classList.contains(cls);
  } else {
    return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1;
  }
}

/**
 * @description: 给DOM元素是否存在指定类名
 */
export function addClass(el: Element, cls: string) {
  if (!el || !cls) return false;
  let curClass = el.className;
  const classes = cls.split(' ');

  for (let i = 0; i < classes.length; i++) {
    const clsName = classes[i];
    if (!clsName) continue;

    if (el.classList) {
      el.classList.add(clsName);
    } else if (!hasClass(el, clsName)) {
      curClass += ' ' + clsName;
    }
  }
  if (!el.classList) {
    el.className = trim(curClass);
  }
}

/**
 * @description: 移除DOM元素的指定类名
 */
export function removeClass(el: Element, cls: string) {
  if (!el || !cls) return false;
  const classes = cls.split(' ');
  let curClass = ' ' + el.className + ' ';

  for (let i = 0; i < classes.length; i++) {
    const clsName = classes[i];
    if (!clsName) continue;

    if (el.classList) {
      el.classList.remove(clsName);
    } else if (hasClass(el, clsName)) {
      curClass = curClass.replace(' ' + clsName + ' ', ' ');
    }
  }
  if (!el.classList) {
    el.className = curClass;
  }
}
