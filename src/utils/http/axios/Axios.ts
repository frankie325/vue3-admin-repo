import type { AxiosRequestConfig, AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import type { CreateAxiosOptions } from './axiosTransform';
import type { RequestOptions, Result, UploadFileParams } from '#/axios';

import axios from 'axios';
import { cloneDeep } from 'lodash-es';
import qs from 'qs';

import { isFunction } from '@/utils/is';
import { RequestEnum, ResultEnum, ContentTypeEnum } from '@/enums/httpEnum';
import { AxiosCanceler } from './axiosCancel';

export class VAxios {
  private axiosInstance: AxiosInstance;
  private readonly options: CreateAxiosOptions;

  constructor(options: CreateAxiosOptions) {
    this.options = options;
    this.axiosInstance = axios.create(options);
    this.setupInterceptors();
  }

  private getTransform() {
    const { transform } = this.options;
    return transform;
  }

  /**
   * @description: 设置axios拦截器
   */
  private setupInterceptors() {
    const transform = this.getTransform();
    if (!transform) {
      return;
    }

    const {
      requestInterceptors,
      requestInterceptorsCatch,
      responseInterceptors,
      responseInterceptorsCatch,
    } = transform;

    const axiosCanceler = new AxiosCanceler();

    // 请求拦截器
    this.axiosInstance.interceptors.request.use((config: CreateAxiosOptions) => {
      const { isSetCancelToken } = config.requestOptions as RequestOptions;
      const isSet =
        isSetCancelToken !== undefined
          ? isSetCancelToken
          : this.options.requestOptions?.isSetCancelToken;
      // 设置cancelToken
      isSet && axiosCanceler.addPending(config);

      if (requestInterceptors && isFunction(requestInterceptors)) {
        // 请求拦截方法
        config = requestInterceptors(config, this.options);
      }
      return config;
    }, undefined);

    // 请求之前的错误拦截处理
    requestInterceptorsCatch &&
      isFunction(requestInterceptorsCatch) &&
      this.axiosInstance.interceptors.request.use(undefined, requestInterceptorsCatch);

    // 响应拦截器
    this.axiosInstance.interceptors.response.use((res: AxiosResponse<any>) => {
      res && axiosCanceler.removePending(res.config); //  响应成功后，移除取消请求的方法
      if (responseInterceptors && isFunction(responseInterceptors)) {
        res = responseInterceptors(res);
      }
      return res;
    }, undefined);

    // 响应错误拦截处理
    responseInterceptorsCatch &&
      isFunction(responseInterceptorsCatch) &&
      this.axiosInstance.interceptors.response.use(undefined, (error) => {
        return responseInterceptorsCatch(this.axiosInstance, error);
      });
  }

  /**
   * @description: Content-Type类型如果为application/x-www-form-urlencoded;charset=UTF-8，使用qs转为a=1&b=c的格式
   */
  supportFormData(config: AxiosRequestConfig) {
    const headers = config.headers || this.options.headers;
    const contentType = headers?.['Content-Type'] || headers?.['content-type'];

    if (
      contentType !== ContentTypeEnum.FORM_URLENCODED ||
      !Reflect.has(config, 'data') ||
      config.method?.toUpperCase() === RequestEnum.GET
    ) {
      return config;
    }

    return {
      ...config,
      data: qs.stringify(config.data, { arrayFormat: 'brackets' }),
    };
  }

  /**
   * @description: get请求方法
   */
  get<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'GET' }, options);
  }
  /**
   * @description: post请求方法
   */
  post<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'POST' }, options);
  }
  /**
   * @description: put请求方法
   */
  put<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'PUT' }, options);
  }
  /**
   * @description: delete请求方法
   */
  delete<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'DELETE' }, options);
  }
  /**
   * @description: 数据请求方法
   * @param config 同axios配置项
   * @param options 请求选项，会覆盖默认的请求选项值
   */
  request<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    let conf: CreateAxiosOptions = cloneDeep(config);

    const transform = this.getTransform();

    // 默认的请求选项
    const { requestOptions } = this.options;

    // 请求方法设置的选项覆盖默认的请求选项值
    const opt: RequestOptions = Object.assign({}, requestOptions, options);

    const { beforeRequestHook, requestCatchHook, transformRequestHook } = transform || {};

    // 请求之前的处理
    if (beforeRequestHook && isFunction(beforeRequestHook)) {
      conf = beforeRequestHook(conf, opt);
    }

    // 将请求选项添加到配置中，拦截器需要用到
    conf.requestOptions = opt;

    // 格式转换
    conf = this.supportFormData(conf);

    return new Promise((resolve, reject) => {
      // 开始发送请求
      this.axiosInstance
        .request<any, AxiosResponse<Result>>(conf)
        .then((res: AxiosResponse<Result>) => {
          if (transformRequestHook && isFunction(transformRequestHook)) {
            try {
              // 处理响应数据
              const ret = transformRequestHook(res, opt);
              resolve(ret);
            } catch (err) {
              reject(err || new Error('request error!'));
            }
            return;
          }
          resolve(res as unknown as Promise<T>);
        })
        .catch((e: Error | AxiosError) => {
          // 响应拦截器抛出的错误处理
          if (requestCatchHook && isFunction(requestCatchHook)) {
            reject(requestCatchHook(e, opt));
            return;
          }
          if (axios.isAxiosError(e)) {
            // rewrite error message from axios in here
          }
          reject(e);
        });
    });
  }
}
