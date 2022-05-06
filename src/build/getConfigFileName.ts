
/**
 * @description: 从环境变量里获取项目简称
 */
export const getConfigFileName = (env: Record<string, any>) => {
    return `__PRODUCTION__${env.VITE_GLOB_APP_SHORT_NAME || "__APP"}__CONF__`.toUpperCase().replace(/\s/g, "");
};
