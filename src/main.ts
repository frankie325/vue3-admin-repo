import { createApp } from 'vue';
import App from './App.vue';

// 先引入tailwind的样式，否则与ant-design-vue有冲突
import './design/index.less';
// 全局引入ant-design-vue
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.less';

import { initAppConfigStore } from '@/logics/initAppConfig';
import { setupI18n } from '@/locales/setupl18n';
import { router, setupRouter } from '@/router';
import { setupRouterGuard } from '@/router/guard';
import { setupStore } from '@/store';

async function bootstrap() {
  const app = createApp(App);

  app.use(Antd);
  // 请勿修改注册顺序

  // 注册全局状态管理插件pinia
  setupStore(app);

  // 初始化pinia仓库状态
  initAppConfigStore();

  // 注册国际化插件
  await setupI18n(app);

  // 注册路由
  setupRouter(app);
  setupRouterGuard(router);

  app.mount('#app');
}

bootstrap();
