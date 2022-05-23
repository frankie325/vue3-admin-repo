// 登录参数接口
export interface LoginParams {
  username: string;
  password: string;
}

// 角色信息接口
export interface RoleInfo {
  roleName: string;
  value: string;
}

// 用户信息接口
export interface GetUserInfoModel {
  roles: RoleInfo[];
  // 用户id
  userId: string | number;
  // 用户名
  username: string;
  // 真实名字
  realName: string;
  // 头像
  avatar: string;
  // 介绍
  desc?: string;
}
