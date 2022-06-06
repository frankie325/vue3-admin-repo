<template>
  <div class="bg-white m-4 p-4">
    <h1 class="text-xl">按钮权限</h1>

    <a-divider />
    <a-space>
      <a-button @click="changeUser(1)">点击切换id为1的用户</a-button>
      <a-button type="primary" @click="changeUser(2)">点击切换id为2的用户</a-button>
    </a-space>
    <a-divider>使用权限组件包裹内容，符合权限的内容才会创建</a-divider>
    <Authority :value="['1000']">
      <div class="w-60 h-60 bg-red-300 text-center">用户1渲染</div>
    </Authority>
    <Authority :value="['2000']">
      <div class="w-60 h-60 bg-blue-300 text-center">用户2渲染</div>
    </Authority>
    <a-divider>使用v-auth指令，控制按钮渲染</a-divider>
    <a-button type="primary" v-auth="'1000'">用户1渲染</a-button>
    <a-button danger v-auth="'2000'">用户2渲染</a-button>
  </div>
</template>
<script setup lang="ts">
  import { Authority } from '@/components/Authority';
  import { usePermission } from '@/hooks/web/usePermission';
  import { useUserStore } from '@/store/modules/user';
  import { usePermissionStore } from '@/store/modules/permission';

  const userStore = useUserStore();
  const permissionStore = usePermissionStore();
  const { refreshMenu } = usePermission();

  // const { changeRole } = usePermission();
  function changeUser(userId: number) {
    const token = 'fakeToken' + userId;
    userStore.setToken(token);

    // 重新获取用户信息和菜单
    userStore.getUserInfoAction();

    // 更新权限列表
    permissionStore.changePermissionCode();
    refreshMenu();
  }
</script>
