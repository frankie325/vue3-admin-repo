import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import { resolve } from "path";

function pathResolve(relativePath: string) {
    return resolve(process.cwd(), relativePath);
}

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: [
            {
                find: "@",
                replacement: pathResolve("src"),
            },
            {
                find: "#",
                replacement: pathResolve("types"),
            },
        ],
    },
});
