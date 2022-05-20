import type { AxiosRequestConfig, AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import type { CreateAxiosOptions } from './axiosTransform';
import type { RequestOptions, Result, UploadFileParams } from '#/axios';

import axios from 'axios';
import { cloneDeep } from 'lodash-es';
import qs from 'qs';

import { isFunction } from '@/utils/is';
import { RequestEnum, ResultEnum, ContentTypeEnum } from '@/enums/httpEnum';

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

    this.axiosInstance.interceptors.request.use((config: AxiosRequestConfig) => {});
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
   * @description: 数据请求方法
   * @param config 同axios配置项
   * @param options 请求选项，会覆盖默认的请求选项值
   */
  request<T = any>(config: AxiosRequestConfig, options?: RequestOptions) {
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

    return new Promise((resolve, reject) => {});
  }
}
