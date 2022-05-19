import type { ProxyOptions } from 'vite';

type ProxyItem = [string, string];

type ProxyList = ProxyItem[];

type ProxyTargetList = Record<string, ProxyOptions>;

const httpsRE = /^https:\/\//;
// [
//   ['/basic-api', 'http://localhost:3300'],
//   ['/upload', 'http://localhost:3400/upload'],
// ];
export function createProxy(list: ProxyList = []) {
  console.log(list);
  const ret: ProxyTargetList = {
    '/api': {
      target: 'http://localhost:3000',
      rewrite: (path) => {
        console.log(path);
        return path.replace(/^\/api/, '');
      },
      changeOrigin: true,
    },
  };
  for (const [prefix, target] of list) {
    console.log(prefix, target);

    const isHttps = httpsRE.test(target);

    ret[prefix] = {
      target: target, //
      changeOrigin: true, // 将主机头的来源更改为目标 URL
      rewrite: (path) => path.replace(new RegExp(`^${prefix}`), ''),
      ...(isHttps ? { secure: false } : {}),
    };
  }

  return ret;
}
