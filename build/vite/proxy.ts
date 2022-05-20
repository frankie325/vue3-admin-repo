import type { ProxyOptions } from 'vite';

type ProxyItem = [string, string];

type ProxyList = ProxyItem[];

type ProxyTargetList = Record<string, ProxyOptions>;

const httpsRE = /^https:\/\//;

/**
 * @description: 开发服务器代理设置
 */
export function createProxy(list: ProxyList = []) {
  const ret: ProxyTargetList = {};
  for (const [prefix, target] of list) {
    console.log(prefix, target);

    const isHttps = httpsRE.test(target);

    ret[prefix] = {
      target: target,
      rewrite: (path) => path.replace(new RegExp(`^${prefix}`), ''),
      ws: true, // 代理 websocket
      changeOrigin: true, // 将主机头的来源更改为目标 URL
      ...(isHttps ? { secure: false } : {}), //是否验证 SSL 证书
    };
  }

  return ret;
}
