import { ref, computed, toRefs, watch, onMounted, Ref } from "vue";
import { Info } from "./useUserRepositories";

export default function useSearchRepositories(repositories: Ref<Array<Info>>) {
    // 搜索框双向绑定的数据
    const searchQuery = ref("");

    // 当依赖的searchQuery数据变化时，重新过滤
    const repositoriesQuery = computed(() => {
        return repositories.value.filter((item) => {
            return item.name.includes(searchQuery.value);
        });
    });

    return {
        searchQuery,
        repositoriesQuery,
    };
}
