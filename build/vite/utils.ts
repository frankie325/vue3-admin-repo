/**
 * @description: // 将环境变量值为字符串的添加到process.env中
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
