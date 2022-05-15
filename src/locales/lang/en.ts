import antdLocale from 'ant-design-vue/es/locale/en_US';
import { genMessage } from '../helper';

const modules = import.meta.globEager('./en/**/*.ts');

// 导入ant-design的英文语言包和自定义的进行合并
export default {
  message: {
    ...genMessage(modules, 'en'),
    antdLocale,
  },
};
