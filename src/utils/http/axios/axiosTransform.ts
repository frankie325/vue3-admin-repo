/**
 * Data processing class, can be configured according to the project
 */
import type { AxiosRequestConfig, AxiosInstance, AxiosResponse } from 'axios';
import type { RequestOptions, Result } from '#/axios';

/**
 * @description: 创建axios实例的参数选项
 */
export interface CreateAxiosOptions extends AxiosRequestConfig {
  authenticationScheme?: string;
  transform?: AxiosTransform;
  requestOptions?: RequestOptions;
}

export abstract class AxiosTransform {
  /**
   * @description: 请求发送之前处理
   */
  beforeRequestHook?: (config: AxiosRequestConfig, options: RequestOptions) => AxiosRequestConfig;

  /**
   * @description: 请求拦截器处理
   */
  requestInterceptors?: (
    config: AxiosRequestConfig,
    options: CreateAxiosOptions,
  ) => AxiosRequestConfig;

  /**
   * @description: 请求拦截器错误处理
   */
  requestInterceptorsCatch?: (error: Error) => void;

  /**
   * @description: 响应拦截处理
   */
  responseInterceptors?: (res: AxiosResponse<Result>) => AxiosResponse<Result>;

  /**
   * @description: 响应拦截器错误处理
   */
  responseInterceptorsCatch?: (axiosInstance: AxiosInstance, error: Error) => void;

  /**
   * @description: 处理响应数据
   */
  transformRequestHook?: (res: AxiosResponse<Result>, options: RequestOptions) => any;

  /**
   * @description: 请求失败处理
   */
  requestCatchHook?: (e: Error, options: RequestOptions) => Promise<any>;
}
