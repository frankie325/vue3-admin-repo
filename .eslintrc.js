// eslint配置

module.exports = {
  // 指定脚本的运行环境，每种环境都有一组特定的预定义全局变量
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  // 继承插件的规则
  extends: [
    // 'plugin:vue/essential',  // 继承eslint-plugin-vue插件配置，vue2的写法，下面是vue3的写法
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended', // 继承@typescript-eslint插件配置
    'plugin:prettier/recommended', // 使用eslint-plugin-prettier插件，解决eslint和prettier的冲突
  ],
  // 使用的解析器，vue-eslint-parser能够检测.vue文件的<template>，和eslint-plugin-vue配合使用
  parser: 'vue-eslint-parser',
  // 解析器选项
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    ecmaFeatures: {
      // 启用jsx
      jsx: true,
    },
  },
  plugins: ['vue', '@typescript-eslint'],
  rules: {
    'no-var': 'warn', // 使用var声明变量则警告
    // 'no-use-before-define': 'off', // 关闭在定义变量之前使用变量的错误提示
    // 'no-unused-vars': 'error', // 未使用的变量错误提示

    // eslint-plugin-vue插件的rules配置：https://eslint.vuejs.org/rules/
    'vue/script-setup-uses-vars': 'error', // <template>中没有使用<script setup>中的变量，则标记为未使用
    'vue/attributes-order': 'off', // 关闭标签属性的强制排序
    'vue/one-component-per-file': 'off', // 关闭每个文件只能定义一个组件
    // 'vue/max-attributes-per-line': 'off', //关闭每行最大属性限制功能
    'vue/attribute-hyphenation': 'off', // 关闭强制将驼峰属性转为连字符的功能
    'vue/require-default-prop': 'warn', // 自定义事件没在emits选项中声明，则警告
    'vue/multi-word-component-names': 'off', // 关闭组件名必须是多个单词

    // @typescript-eslint插件的rules配置：https://typescript-eslint.io/rules/
    '@typescript-eslint/no-explicit-any': 'off', // 关闭any类型的警告
    '@typescript-eslint/no-empty-function': 'off', // 关闭空函数错误提示
    '@typescript-eslint/ban-ts-comment': 'off', // 关闭使用ts注释错误提示
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-unused-vars': 'warn', // 未使用的变量错误提示
    '@typescript-eslint/no-use-before-define': 'off', // 关闭在定义变量之前使用变量的错误提示
  },
};
