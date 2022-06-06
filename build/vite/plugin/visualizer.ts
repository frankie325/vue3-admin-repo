/**
 * Package file volume analysis
 */
import type { PluginOption } from 'vite';
import visualizer from 'rollup-plugin-visualizer';
import { isReportMode } from '../../utils';

export function configVisualizerConfig() {
  if (isReportMode()) {
    return visualizer({
      filename: './node_modules/.cache/visualizer/stats.html', // 生成的分析图谱文件
      open: true, //自动打开分析图谱文件
      gzipSize: true,
      brotliSize: true,
    }) as PluginOption;
  }
  return [];
}
