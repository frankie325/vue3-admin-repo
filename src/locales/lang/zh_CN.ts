import antdLocale from 'ant-design-vue/es/locale/zh_CN';
import { genMessage } from '../helper';

const modules = import.meta.globEager('./zh-CN/**/*.ts');

// 导入ant-design的中文语言包和自定义的进行合并
export default {
  message: {
    ...genMessage(modules, 'zh-CN'),
    antdLocale,
  },
};
