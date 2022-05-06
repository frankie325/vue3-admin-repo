/*
    使用Tailwind CSS

    Tailwind CSS 依赖 PostCss进行构建
    
    安装步骤：
    1. npm install -D tailwindcss@latest postcss@latest autoprefixer@latest

    2. npx tailwindcss init -p 生成 tailwind.config.js 和 postcss.config.js 文件

    3. 在./src/design/index.less 引入 @tailwind 指令
        @tailwind base;
        @tailwind components;
        @tailwind utilities;
       在 main.js 引入index.less
    
    4. 重新启动项目即可使用Tailwind CSS
*/ 

module.exports = {
    // 未使用的样式将进行摇树优化
    content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
    theme: {
        extend: {},
    },
    plugins: [],
};
