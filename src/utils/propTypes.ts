import { CSSProperties, VNodeChild } from 'vue';
import { createTypes, VueTypeValidableDef, VueTypesInterface } from 'vue-types';

// https://dwightjack.github.io/vue-types/#when-to-use
// 使用vue-types对props进行校验
export type VueNode = VNodeChild | JSX.Element;

// 自定义VueTypes 验证器接口
type PropTypes = VueTypesInterface & {
  readonly style: VueTypeValidableDef<CSSProperties>;
  readonly VNodeChild: VueTypeValidableDef<VueNode>;
  // readonly trueBool: VueTypeValidableDef<boolean>;
};

// 重新创建一个新的VueTypes实例
const propTypes = createTypes({
  func: undefined,
  bool: undefined,
  string: undefined,
  number: undefined,
  object: undefined,
  integer: undefined,
}) as PropTypes;

// 通过VueTypes.extend扩展自定义验证器
propTypes.extend([
  {
    name: 'style',
    getter: true,
    type: [String, Object],
    default: undefined,
  },
  {
    name: 'VNodeChild',
    getter: true,
    type: undefined,
  },
]);
export { propTypes };
