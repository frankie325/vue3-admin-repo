import { RoleInfo } from '@/api/sys/model/userModel';

// 屏幕锁定信息接口
export interface LockInfo {
  pws?: string | undefined;
  isLock?: boolean;
}

// 用户信息接口
export interface UserInfo {
  userId: string | number;
  username: string;
  realName: string;
  avatar: string;
  desc?: string;
  // 用户登录时跳转的首页
  homePath?: string;
  roles: RoleInfo[];
}
