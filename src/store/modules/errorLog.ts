import { ErrorLogInfo } from '#/axios';
import { defineStore } from 'pinia';
import { store } from '@/store';
import projectSetting from '@/settings/projectSetting';
import { ErrorTypeEnum } from '@/enums/exceptionEnum';
import { formatToDateTime } from '@/utils/dateUtil';

export interface ErrorLogState {
  errorLogInfoList: Nullable<ErrorLogInfo[]>;
  errorLogListCount: number;
}

/**
 * @description: 收集错误信息仓库
 */
export const useErrorLogStore = defineStore({
  id: 'app-error-log',
  state: (): ErrorLogState => ({
    errorLogInfoList: null,
    errorLogListCount: 0, //错误信息统计条数
  }),
  getters: {
    getErrorLogInfoList(): ErrorLogInfo[] {
      return this.errorLogInfoList || [];
    },
    getErrorLogListCount(): number {
      return this.errorLogListCount;
    },
  },
  actions: {
    /**
     * @description: 将错误信息添加到errorLogInfoList中
     */
    addErrorLogInfo(info: ErrorLogInfo) {
      const item = {
        ...info,
        time: formatToDateTime(new Date()),
      };
      this.errorLogInfoList = [item, ...(this.errorLogInfoList || [])];
      this.errorLogListCount += 1;
    },

    /**
     * @description: 按照ErrorLogInfo类型生成错误信息格式
     */
    addAjaxErrorInfo(error: any) {
      const { useErrorHandle } = projectSetting;
      if (!useErrorHandle) return;

      // 获取错误信息
      const errInfo: Partial<ErrorLogInfo> = {
        message: error.message,
        type: ErrorTypeEnum.AJAX, //错误类型
      };

      if (error.response) {
        const {
          config: { url = '', data: params = '', method = 'get', headers = {} } = {},
          data = {},
        } = error.response;
        errInfo.url = url;
        errInfo.name = 'Ajax Error!';
        errInfo.file = '-';
        errInfo.stack = JSON.stringify(data);
        errInfo.detail = JSON.stringify({ params, method, headers });
      }

      this.addErrorLogInfo(errInfo as ErrorLogInfo);
    },

    /**
     * @description: 设置错误信息统计条数
     */
    setErrorLogListCount(count: number): void {
      this.errorLogListCount = count;
    },
  },
});

export function useErrorLogStoreWithOut() {
  return useErrorLogStore(store);
}
