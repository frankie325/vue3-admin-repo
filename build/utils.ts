import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

/**
 * @description 打包分析时用到，执行npm run report，进行打包分析
 */
export function isReportMode(): boolean {
  return process.env.REPORT === 'true';
}

/**
 * @description: 将环境变量值为字符串的添加到process.env中
 * @return {*} 返回该项目对应环境下的所有定义的环境变量，转为js值
 */
export function wrapperEnv(envConf: Recordable): ViteEnv {
  const ret: any = {};
  for (const envName of Object.keys(envConf)) {
    let realName = envConf[envName].replace(/\\n/g, '\n');

    // 因为环境变量的值全是字符，需要转为js值
    realName = realName === 'true' ? true : realName === 'false' ? false : realName;
    if (envName === 'VITE_PORT') {
      realName = Number(realName);
    }
    if (envName === 'VITE_PROXY' && realName) {
      try {
        realName = JSON.parse(realName);
      } catch (error) {
        realName = '';
      }
    }

    ret[envName] = realName;

    // 将环境变量值为字符串的添加到process.env中
    if (typeof realName === 'string') {
      process.env[envName] = realName;
    } else if (typeof realName === 'object') {
      process.env[envName] = JSON.stringify(realName);
    }
  }
  return ret;
}

/**
 * @description 获取当前环境下生效的配置文件名
 */
function getConfFiles() {
  const script = process.env.npm_lifecycle_script;
  const reg = new RegExp('--mode ([a-z_\\d]+)');
  const result = reg.exec(script as string) as any;
  if (result) {
    const mode = result[1] as string;
    return ['.env', `.env.${mode}`];
  }
  return ['.env', '.env.production'];
}

/**
 * @description: 获取以VITE_GLOB_开头的环境变量
 */
export function getEnvConfig(match = 'VITE_GLOB_', confFiles = getConfFiles()) {
  let envConfig = {};
  confFiles.forEach((item) => {
    try {
      // 使用dotenv解析.env文件，得到包含环境变量的对象
      const env = dotenv.parse(fs.readFileSync(path.resolve(process.cwd(), item)));
      envConfig = { ...envConfig, ...env };
    } catch (e) {
      console.error(`Error in parsing ${item}`, e);
    }
  });

  // 将VITE_GLOB_开头的环境变量筛选出来
  const reg = new RegExp(`^(${match})`);
  Object.keys(envConfig).forEach((key) => {
    if (!reg.test(key)) {
      Reflect.deleteProperty(envConfig, key);
    }
  });

  return envConfig;
}

/**
 * @description: 获取项目根目录下文件的绝对路径
 */
export function getRootPath(...dir: string[]) {
  return path.resolve(process.cwd(), ...dir);
}
