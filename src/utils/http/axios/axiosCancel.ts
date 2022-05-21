import type { AxiosRequestConfig, Canceler } from 'axios';
import axios from 'axios';
import { isFunction } from '@/utils/is';

// 存储取消请求的方法
const pendingMap = new Map<string, Canceler>();

/**
 * @description: 生成存储的key
 */
export const getPendingUrl = (config: AxiosRequestConfig) => [config.method, config.url].join('&');

/**
 * @description: 忽略重复请求：比如路由页面跳转，tab栏的高频切换，搜索框的change事件，短时间内重复发送多个请求
 */
export class AxiosCanceler {
  addPending(config: AxiosRequestConfig) {
    const url = getPendingUrl(config);

    // 设置配置中的cancelToken属性
    config.cancelToken =
      config.cancelToken ||
      new axios.CancelToken((cancel) => {
        // 得到一个cancel方法，添加到Map中
        if (!pendingMap.has(url)) {
          pendingMap.set(url, cancel);
        }
      });
  }
}
