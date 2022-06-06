<template>
  <div class="bg-white m-4 p-4">
    <h1 class="text-xl">后台权限模式</h1>

    <a-divider />
    <div class="mb-2">仅用于演示，实际生产时切换身份应当重新登录</div>
    <a-space>
      <a-button @click="changeUser(1)">点击切换id为1的用户</a-button>
      <a-button type="primary" @click="changeUser(2)">点击切换id为2的用户</a-button>
    </a-space>
    <a-divider />
    <a-alert message="观察左侧菜单的变化" type="info" show-icon />
  </div>
</template>
<script setup lang="ts">
  import { usePermission } from '@/hooks/web/usePermission';
  import { useAppStore } from '@/store/modules/app';
  import { useUserStore } from '@/store/modules/user';

  const userStore = useUserStore();
  const { refreshMenu } = usePermission();

  // const { changeRole } = usePermission();
  function changeUser(userId: number) {
    const token = 'fakeToken' + userId;
    userStore.setToken(token);

    // 重新获取用户信息和菜单
    userStore.getUserInfoAction();

    refreshMenu();
  }
</script>
