<template>
    <div>
        <div>StudyCompositionApi</div>
        <a-input v-model:value="searchQuery" placeholder="Basic usage" />
        <div v-for="(item, index) in repositoriesQuery" :key="index">{{ item.name }}</div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, watch, onMounted } from "vue";

import useUserRepositories from "./useUserRepositories";
import useSearchRepositories from "./useSearchRepositories";
export default defineComponent({
    props: {
        userId: {
            type: String,
            required: true,
        },
    },
    // 组合式Api：将逻辑都分离到单独的ts文件中，提取为可重用的代码段
    setup(props, context) {
        const { userId } = toRefs(props);

        // 将请求数据的逻辑进行分离
        const { repositories, getUserRepositories } = useUserRepositories(userId);

        // 将搜索功能的逻辑进行分离
        const { searchQuery, repositoriesQuery } = useSearchRepositories(repositories);

        return {
            searchQuery, //与输入框双向绑定
            repositoriesQuery,
        };
    },
    data() {},
    methods: {},
});
</script>
