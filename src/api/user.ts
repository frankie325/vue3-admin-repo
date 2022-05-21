import { ErrorMessageMode } from '#/axios';
import { LoginParams } from './sys/userModel';
import { defHttp } from '@/utils/http/axios';

enum Api {
  Login = '/login1',
  Logout = '/logout',
  GetUserInfo = '/getUserInfo',
  GetPermCode = '/getPermCode',
  TestRetry = '/testRetry',
}

export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post(
    {
      url: Api.Login,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}
