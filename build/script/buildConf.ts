import fs, { writeFileSync } from 'fs-extra';
import colors from 'picocolors';

import pkg from '../../package.json';
import { GLOB_CONFIG_FILE_NAME, OUTPUT_DIR } from '../constant';
import { getEnvConfig, getRootPath } from '../utils';
import { getConfigFileName } from '../getConfigFileName';

interface CreateConfigParams {
  configName: string;
  config: any;
  configFileName?: string;
}

function createConfig(params: CreateConfigParams) {
  const { configName, config, configFileName } = params;

  try {
    // 将环境变量挂载到window的变量上
    const windowConf = `window.${configName}`;
    // 确保该变量不可修改
    const configStr = `${windowConf}=${JSON.stringify(config)};
      Object.freeze(${windowConf});
      Object.defineProperty(window, "${configName}", {
        configurable: false,
        writable: false,
      });
    `.replace(/\s/g, '');
    // 创建打包目录，因为vite打包时已经创建了，这里是确保打包目录的存在
    fs.mkdirp(getRootPath(OUTPUT_DIR));
    // 将内容输出到_app.config.js文件中
    writeFileSync(getRootPath(`${OUTPUT_DIR}/${configFileName}`), configStr);

    console.log(colors.cyan(`✨ [${pkg.name}]`) + ` - configuration file is build successfully:`);
    console.log(colors.gray(OUTPUT_DIR + '/' + colors.green(configFileName)) + '\n');
  } catch (error) {
    console.log(colors.red('configuration file configuration file failed to package:\n' + error));
  }
}

export function runBuildConfig() {
  const config = getEnvConfig(); // 获取以VITE_GLOB_开头的环境变量
  const configFileName = getConfigFileName(config);
  createConfig({ config, configName: configFileName, configFileName: GLOB_CONFIG_FILE_NAME });
}
