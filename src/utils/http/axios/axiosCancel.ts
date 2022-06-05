import type { AxiosRequestConfig, Canceler } from 'axios';
import axios from 'axios';
import { isFunction } from '@/utils/is';

// 存储取消请求的方法
let pendingMap = new Map<string, Canceler>();

/**
 * @description: 生成存储的key
 */
export const getPendingUrl = (config: AxiosRequestConfig) => [config.method, config.url].join('&');

/**
 * @description: 忽略重复请求：比如路由页面跳转，tab栏的高频切换，搜索框的change事件，短时间内重复发送多个请求
 */
export class AxiosCanceler {
  /**
   * @description: 添加取消请求方法到pendingMap中
   */
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

  /**
   * @description: 执行pendingMap中的所有取消请求方法，并清空pendingMap
   */
  removeAllPending() {
    pendingMap.forEach((cancel) => {
      cancel && isFunction(cancel) && cancel();
    });
    pendingMap.clear();
  }

  /**
   * @description: 响应成功后，移除取消请求的方法
   */
  removePending(config: AxiosRequestConfig) {
    const url = getPendingUrl(config);

    if (pendingMap.has(url)) {
      // If there is a current request identifier in pending,
      // the current request needs to be cancelled and removed
      const cancel = pendingMap.get(url);
      cancel && cancel(url);
      pendingMap.delete(url);
    }
  }

  reset(): void {
    pendingMap = new Map<string, Canceler>();
  }
}
