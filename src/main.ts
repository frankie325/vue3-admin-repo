import './design/index.less';

import { createApp } from 'vue';
import Antd from 'ant-design-vue';
import App from './App.vue';

import 'ant-design-vue/dist/antd.css';

import { router, setupRouter } from '@/router';
import { setupRouterGuard } from '@/router/guard';
import { setupStore } from '@/store';

const app = createApp(App);

app.use(Antd);

// 请勿修改注册顺序

// 注册全局状态管理插件pinia
setupStore(app);

// 注册路由
setupRouter(app);
setupRouterGuard(router);

app.mount('#app');

let b;
