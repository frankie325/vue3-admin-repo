import { useAppProviderContext } from '@/components/Application/src/useAppContext';

/**
 * @description: 生成前缀样式
 */
export function useDesign(scope: string) {
  const values = useAppProviderContext();

  return {
    prefixCls: `${values.prefixCls}-${scope}`,
    prefixVar: values.prefixCls,
  };
}
