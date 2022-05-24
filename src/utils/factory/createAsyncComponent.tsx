import { defineAsyncComponent } from 'vue';
import { Spin } from 'ant-design-vue';
import { noop } from '@/utils';

interface Options {
  size?: 'default' | 'small' | 'large';
  delay?: number; // 在显示 loadingComponent 之前的延迟
  timeout?: number; // 如果提供了 timeout ，并且加载组件的时间超过了设定值，将显示错误组件
  loading?: boolean;
  retry?: boolean; // 加载失败时是否应该重试
}

/**
 * @description: 使用异步组件
 */
export function createAsyncComponent(loader: Fn, options: Options = {}) {
  const { size = 'small', delay = 100, timeout = 30000, loading = false, retry = true } = options;
  return defineAsyncComponent({
    loader,
    loadingComponent: loading ? <Spin spinning={true} size={size} /> : undefined, // 加载异步组件时要使用的组件
    timeout,
    delay,
    onError: !retry
      ? noop
      : (error, retry, fail, attempts) => {
          if (error.message.match(/fetch/) && attempts <= 3) {
            retry();
          } else {
            fail();
          }
        },
  });
}
