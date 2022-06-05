import type { AppRouteModule } from '@/router/types';

import { LAYOUT, getParentLayout } from '@/router/constant';
const IFrame = () => import('@/views/sys/iframe/FrameBlank.vue'); // 内嵌页面路由渲染的占位页面
import { t } from '@/hooks/web/useI18n';

const iframe: AppRouteModule = {
  path: '/frame',
  name: 'Frame',
  component: LAYOUT,
  redirect: '/frame/doc',
  meta: {
    orderNo: 1000,
    icon: 'ion:tv-outline',
    title: t('routes.demo.iframe.frame'),
  },

  children: [
    {
      path: 'bilibili',
      name: 'Bilibili',
      component: IFrame,
      // component: getParentLayout('Bilibili'),
      meta: {
        frameSrc: 'https://www.bilibili.com/',
        title: '哔哩哔哩(内嵌)',
      },
    },
    {
      path: 'https://www.baidu.com/',
      name: 'Baidu',
      component: IFrame,
      // component: getParentLayout('Baidu'),
      meta: {
        title: '百度(外链)',
      },
    },
  ],
};

export default iframe;
