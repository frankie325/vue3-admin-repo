import type { AxiosTransform, CreateAxiosOptions } from './axiosTransform';
import type { AxiosResponse } from 'axios';

import { clone } from 'lodash-es';

import { deepMerge } from '@/utils';
import { VAxios } from './Axios';
import { RequestEnum, ResultEnum, ContentTypeEnum } from '@/enums/httpEnum';
import { useGlobSetting } from '@/hooks/setting/';
import { isString } from '@/utils/is';
import { joinTimestamp, formatRequestDate } from './helper';
import { setObjToUrlParams } from '@/utils';
import { getToken } from '@/utils/auth';
import { useI18n } from '@/hooks/web/useI18n';
import { useErrorLogStoreWithOut } from '@/store/modules/errorLog';
import { useMessage } from '@/hooks/web/useMessage';
import { checkStatus } from './checkStatus';
import { AxiosRetry } from '@/utils/http/axios/axiosRetry';

const { createMessage, createErrorModal } = useMessage();

const globSetting = useGlobSetting();

// 默认数据处理方式
const transform: AxiosTransform = {
  /**
   * @description: 请求发送之前调用
   * @param config axios配置
   * @param options 请求选项
   */
  beforeRequestHook: (config, options) => {
    const { apiUrl, joinPrefix, joinParamsToUrl, formatDate, joinTime = true, urlPrefix } = options;

    // 请求url先拼接前缀 VITE_GLOB_API_URL_PREFIX
    if (joinPrefix) {
      config.url = `${urlPrefix}${config.url}`;
    }

    // 在拼接请求地址 VITE_GLOB_API_URL
    if (apiUrl && isString(apiUrl)) {
      config.url = `${apiUrl}${config.url}`;
    }

    const params = config.params || {};
    const data = config.data || false;

    // 格式化参数中的时间字段
    formatDate && data && !isString(data) && formatRequestDate(data);

    if (config.method?.toUpperCase() === RequestEnum.GET) {
      if (!isString(params)) {
        // 给 get 请求加上时间戳参数，避免从缓存中拿数据
        config.params = Object.assign(params || {}, joinTimestamp(joinTime, false));
      } else {
        // params如果是字符，axios是无法识别的，直接拼接到url后面
        // 兼容restful风格
        config.url = config.url + params + `${joinTimestamp(joinTime, true)}`;
        config.params = undefined;
      }
    } else {
      if (!isString(params)) {
        formatDate && formatRequestDate(params);

        if (Reflect.has(config, 'data') && config.data && Object.keys(config.data).length > 0) {
          // 如果params和data同时存在，params参数会拼接到url后面
          config.data = data;
          config.params = params;
        } else {
          // 非GET请求如果没有提供data，则将params视为data
          config.data = params;
          config.params = undefined;
        }
        if (joinParamsToUrl) {
          // 将params参数添加到url
          config.url = setObjToUrlParams(
            config.url as string,
            Object.assign({}, config.params, config.data),
          );
        }
      } else {
        // 兼容restful风格
        config.url = config.url + params;
        config.params = undefined;
      }
    }
    return config;
  },

  /**
   * @description: 请求拦截器处理
   */
  requestInterceptors: (config, options) => {
    const token = getToken();
    // 将token添加到请求头
    if (token && (config as Recordable).requestOptions?.withToken !== false) {
      (config as Recordable).headers.Authorization = options.authenticationScheme
        ? `${options.authenticationScheme} ${token}`
        : token;
    }
    return config;
  },

  /**
   * @description: 请求之前的错误拦截处理
   */
  requestInterceptorsCatch(error) {
    throw error;
  },

  /**
   * @description: 响应拦截处理
   */
  responseInterceptors: (res: AxiosResponse<any>) => {
    return res;
  },

  /**
   * @description: 响应错误处理
   */
  responseInterceptorsCatch: (axiosInstance, error) => {
    const { t } = useI18n();
    const errorLogStore = useErrorLogStoreWithOut();
    errorLogStore.addAjaxErrorInfo(error); // 收集错误信息

    // 开始处理错误信息
    const { response, code, message, config } = error || {};
    const errorMessageMode = config?.requestOptions?.errorMessageMode || 'none'; // 错误消息提示类型

    const msg: string = response?.data?.error?.message ?? '';
    const err: string = error?.toString?.() ?? '';
    let errMessage = '';
    debugger;

    try {
      if (code === 'ECONNABORTED' && message.indexOf('timeout') !== -1) {
        errMessage = t('sys.api.apiTimeoutMessage');
      }

      if (err?.includes('Network Error')) {
        errMessage = t('sys.api.networkExceptionMsg');
      }

      if (errMessage) {
        if (errorMessageMode === 'modal') {
          createErrorModal({ title: t('sys.api.errorTip'), content: errMessage });
        } else if (errorMessageMode === 'message') {
          createMessage.error(errMessage);
        }
        return Promise.reject(error);
      }
    } catch (error) {
      throw new Error(error as unknown as string);
    }

    // 状态码处理
    checkStatus(error?.response?.status, msg, errorMessageMode);

    // 添加自动重试机制 保险起见 只针对GET请求
    const retryRequest = new AxiosRetry();
    const { isOpenRetry } = config.requestOptions.retryRequest;
    config.method?.toUpperCase() === RequestEnum.GET &&
      isOpenRetry &&
      // @ts-ignore
      retryRequest.retry(axiosInstance, error);
    return Promise.reject(error);
  },
};

/**
 * @description: 创建Axios实例
 */
function createAxios(opt?: Partial<CreateAxiosOptions>) {
  return new VAxios(
    deepMerge(
      {
        // https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#authentication_schemes
        // http身份验证方案
        authenticationScheme: '',
        // 超时时间
        timeout: 10 * 1000,
        // 参数格式
        headers: { 'Content-Type': ContentTypeEnum.JSON },
        // 数据处理方式
        transform: clone(transform),
        // 配置项，下面的选项都可以在独立的接口请求中覆盖
        requestOptions: {
          // 默认将 VITE_GLOB_API_URL_PREFIX 添加到url
          joinPrefix: true,
          // 是否返回原生响应头 比如：需要获取响应头时使用该属性
          isReturnNativeResponse: false,
          // 需要对返回数据进行处理
          isTransformResponse: true,
          // post请求的时候添加参数到url
          joinParamsToUrl: false,
          // 格式化提交参数时间
          formatDate: true,
          // 消息提示类型
          errorMessageMode: 'message',
          // 接口地址
          apiUrl: globSetting.apiUrl,
          // 接口拼接地址
          urlPrefix: globSetting.urlPrefix,
          // 是否加入时间戳
          joinTime: true,
          // 是否默认添加CancelToken配置
          isSetCancelToken: false,
          // 是否携带token
          withToken: true,
          // 添加自动重试机制 保险起见 只针对GET请求
          retryRequest: {
            isOpenRetry: true,
            count: 5, // 最大尝试次数
            waitTime: 100, // 重试的时间间隔
          },
        },
      },
      opt || {},
    ),
  );
}

export const defHttp = createAxios();
