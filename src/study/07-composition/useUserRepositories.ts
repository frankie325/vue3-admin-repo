import { ref, toRefs, watch, onMounted, Ref } from 'vue';

export interface Info {
  name: string;
  age: number;
}

// 将逻辑都分离到单独的文件中
export default function useUserRepositories(userId: Ref<string>) {
  const repositories = ref<Array<Info>>([]);

  // 模拟数据请求
  const getUserRepositories = function (userId: string) {
    // console.log("请求发送中...");
    repositories.value = [
      {
        name: 'kfg',
        age: 23,
      },
      {
        name: 'tom',
        age: 12,
      },
    ];
  };

  // 监听userId的变化，然后重新请求数据
  watch(userId, getUserRepositories);

  onMounted(() => {
    getUserRepositories(userId.value);
  });

  return {
    repositories,
    getUserRepositories,
  };
}
