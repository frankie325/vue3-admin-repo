<template>
  <div></div>
</template>
<script lang="ts" setup>
  /**
   * 重定向页面：当路由跳转地址与之前一样时，不会刷新页面，以重定向页面作为桥梁，实现相同路由的跳转也能刷新页面
   */
  import { unref } from 'vue';
  import { useRouter } from 'vue-router';

  const { currentRoute, replace } = useRouter();

  const { params, query } = unref(currentRoute);
  const { path, _redirect_type = 'path' } = params;

  Reflect.deleteProperty(params, '_redirect_type');
  Reflect.deleteProperty(params, 'path');

  const _path = Array.isArray(path) ? path.join('/') : path;

  // 使用name跳转
  if (_redirect_type === 'name') {
    replace({
      name: _path,
      query,
      params,
    });
  } else {
    // 使用path跳转
    replace({
      path: _path.startsWith('/') ? _path : '/' + _path,
      query,
    });
  }
</script>
