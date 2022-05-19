// 使用stylelint校验样式，默认给css文件提供错误提示，如果其他文件也需要错误提示，需配合VSCode stylelint插件使用

module.exports = {
  root: true,
  // stylelint-config-standard插件为推荐配置，stylelint-config-prettier插件会关闭和prettier冲突的规则
  extends: ['stylelint-config-standard', 'stylelint-config-prettier'],
  plugins: ['stylelint-order'], //stylelint-order插件在格式化css文件时对代码的属性进行排序
  rules: {
    //css块的顺序
    'order/order': [
      [
        'dollar-variables',
        'custom-properties',
        'at-rules',
        'declarations',
        {
          type: 'at-rule',
          name: 'supports',
        },
        {
          type: 'at-rule',
          name: 'media',
        },
        'rules',
      ],
      { severity: 'warning' },
    ],
    // css属性的顺序
    // 'order/properties-order': ['width', 'height'],
    // 忽略下述以@符号开头的报错提示
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'tailwind',
          'apply',
          'variants',
          'responsive',
          'screen',
          'function',
          'if',
          'each',
          'include',
          'mixin',
        ],
      },
    ],
    'no-descending-specificity': null,
    'function-no-unknown': null, // 关闭未知函数的错误提示
    'font-family-no-duplicate-names': null, // 关闭重复字体族名称的错误提示
  },
  // 匹配文件，提供配置，能够覆盖常规配置
  overrides: [
    {
      files: ['*.vue', '**/*.vue', '*.html', '**/*.html'],
      customSyntax: 'postcss-html', // postcss-html插件对style标签以及内联样式应用修复
      extends: ['stylelint-config-recommended', 'stylelint-config-prettier'], //stylelint-config-recommended推荐的用于Stylelint的可共享配置。
    },
    {
      files: ['*.less', '**/*.less'],
      customSyntax: 'postcss-less', //校验less文件时，使用postcss-less插件解析less文件
      extends: [
        'stylelint-config-standard',
        'stylelint-config-recommended-vue',
        'stylelint-config-prettier',
      ],
    },
  ],
  // 忽略的文件
  ignoreFiles: ['**/*.js', '**/*.jsx', '**/*.tsx', '**/*.ts'],
};
