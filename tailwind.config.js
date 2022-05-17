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

const plugin = require('tailwindcss/plugin');

module.exports = {
  // 未使用的样式将进行摇树优化
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'media',
  theme: {
    // 重新设置项目断点
    screens: {
      xs: '480px',
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
      '2xl': '1600px',
    },
    extend: {},
  },
  plugins: [
    plugin(function ({ addBase }) {
      createEnterPlugin(addBase);
    }),
  ],
};

/**
 * @description: 给子元素添加自定义进入动画
 * @param {maxOutput} 最大一起
 */
function createEnterPlugin(addBase, maxOutput = 6) {
  const createCss = (index, d = 'x') => {
    const upd = d.toUpperCase();
    // enter-x 为右到左的动画  -enter-x 为左到右的动画
    // enter-y 为下到上的动画  -enter-y 为右到左的动画
    return {
      [`.enter-${d}:nth-child(${index})`]: {
        transform: `translate${upd}(50px)`,
      },
      [`.-enter-${d}:nth-child(${index})`]: {
        transform: `translate${upd}(-50px)`,
      },
      [`.enter-${d}:nth-child(${index}), .-enter-${d}:nth-child(${index})`]: {
        'z-index': `${10 - index}`,
        opacity: '0',
        animation: `enter-${d}-animation 0.4s ease-in-out 0.3s`,
        'animation-fill-mode': 'forwards',
        'animation-delay': `${(index * 1) / 10}s`,
      },
    };
  };

  const css = {};
  for (let index = 1; index < maxOutput; index++) {
    Object.assign(css, {
      ...createCss(index, 'x'),
      ...createCss(index, 'y'),
    });
  }

  addBase({
    ...css,
    [`@keyframes enter-x-animation`]: {
      to: {
        opacity: '1',
        transform: 'translateX(0)',
      },
    },
    [`@keyframes enter-y-animation`]: {
      to: {
        opacity: '1',
        transform: 'translateY(0)',
      },
    },
  });
}
