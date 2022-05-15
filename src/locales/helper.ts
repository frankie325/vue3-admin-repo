import { set } from 'lodash-es';
import { LocaleType } from '#/config';

/**
 * @description: 将自定义语言文件进行整合转为message
 */
export function genMessage(langs: Record<string, Record<string, any>>, prefix = 'lang') {
  const obj: Recordable = {};

  Object.keys(langs).forEach((key) => {
    const langFileModule = langs[key].default;
    let fileName = key.replace(`./${prefix}/`, '').replace(/^\.\//, '');
    const lastIndex = fileName.lastIndexOf('.');
    fileName = fileName.substring(0, lastIndex);
    const keyList = fileName.split('/');
    const moduleName = keyList.shift();
    const objKey = keyList.join('.');

    if (moduleName) {
      if (objKey) {
        // 最多嵌套一层文件夹
        set(obj, moduleName, obj[moduleName] || {});
        set(obj[moduleName], objKey, langFileModule);
      } else {
        set(obj, moduleName, langFileModule || {});
      }
    }
  });

  /*
  生成的message格式为
  {
    routes:{
      basic:{ 
    },
    sys:{
      
    }
  }
  */
  return obj;
}

/**
 * @description: 设置html的lang属性
 */
export function setHtmlPageLang(locale: LocaleType) {
  document.querySelector('html')?.setAttribute('lang', locale);
}

// 设置过的语言存到该数组，无需重新设置message
export const loadLocalePool: LocaleType[] = [];

export function setLoadLocalePool(cb: (loadLocalePool: LocaleType[]) => void) {
  cb(loadLocalePool);
}
