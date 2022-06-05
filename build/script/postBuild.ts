// import {  } from "module";

import colors from 'picocolors';

import pkg from '../../package.json';
import { runBuildConfig } from './buildConf';

export const runBuild = async () => {
  try {
    const argvList = process.argv.splice(2);

    if (!argvList.includes('disabled-config')) {
      runBuildConfig();
    }
    // 打包结束
    console.log(`✨ ${colors.cyan(`[${pkg.name}]`)}` + ' - build successfully!');
  } catch (error) {
    // 错误了则退出进程
    console.log(colors.red('vite build error:\n' + error));
    process.exit(1);
  }
};
runBuild();
