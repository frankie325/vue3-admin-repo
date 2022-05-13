import { RoleInfo } from '@/api/sys/userModel';

// 用户信息接口
export interface UserInfo {
  userId: string | number;
  username: string;
  realName: string;
  avatar: string;
  desc?: string;
  homePath?: string;
  roles: RoleInfo[];
}
