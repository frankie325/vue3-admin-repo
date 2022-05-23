interface TreeHelperConfig {
  id: string;
  children: string;
  pid: string;
}

const DEFAULT_CONFIG: TreeHelperConfig = {
  id: 'id',
  children: 'children',
  pid: 'pid',
};

/**
 * @description: 将获取操作obj.children转为obj[config.children]获取
 */
const getConfig = (config: Partial<TreeHelperConfig>) => Object.assign({}, DEFAULT_CONFIG, config);

/**
 * @description: 过滤嵌套树形结构的节点
 * @param func 回调方法参数返回false，则会过滤该节点
 */
export function filter<T = any>(
  tree: T[],
  func: (n: T) => boolean,
  config: Partial<TreeHelperConfig> = {},
): T[] {
  config = getConfig(config);
  const children = config.children as string;
  function listFilter(list: T[]) {
    return list
      .map((node: any) => ({ ...node }))
      .filter((node) => {
        // 子节点递归过滤
        node[children] = node[children] && listFilter(node[children]);
        // 筛选出符合条件的节点 或者 有子节点则不会过滤
        return func(node) || (node[children] && node[children].length);
      });
  }
  return listFilter(tree);
}

/**
 * @description: 处理树形数据
 */
export function treeMap<T = any>(treeData: T[], opt: { children?: string; conversion: Fn }): T[] {
  return treeData.map((item) => treeMapEach(item, opt));
}

/**
 * @description: 处理树节点数据
 * @param children 默认为字符children，子节点的字段名称，可以设置为其他
 * @param conversion 由用户传递，用来生成用户想要的数据格式
 */
export function treeMapEach(
  data: any,
  { children = 'children', conversion }: { children?: string; conversion: Fn },
) {
  const haveChildren = Array.isArray(data[children]) && data[children].length > 0;

  const conversionData = conversion(data) || {};
  if (haveChildren) {
    return {
      ...conversionData,
      // 递归处理子节点
      [children]: data[children].map((i: number) =>
        treeMapEach(i, {
          children,
          conversion,
        }),
      ),
    };
  } else {
    return {
      ...conversionData,
    };
  }
}

export function findPath<T = any>(
  tree: any,
  func: Fn,
  config: Partial<TreeHelperConfig> = {},
): T | T[] | null {
  config = getConfig(config);
  const path: T[] = [];
  const list = [...tree];
  const visitedSet = new Set();
  const { children } = config;
  while (list.length) {
    const node = list[0];
    if (visitedSet.has(node)) {
      path.pop();
      list.shift();
    } else {
      visitedSet.add(node);
      node[children!] && list.unshift(...node[children!]);
      path.push(node);
      if (func(node)) {
        return path;
      }
    }
  }
  return null;
}
