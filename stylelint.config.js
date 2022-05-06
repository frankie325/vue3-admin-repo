module.exports = {
  root: true,
  // stylelint-config-prettier插件会关闭和prettier冲突的规则
  extends: ['stylelint-config-standard', 'stylelint-config-prettier'],
  plugins: ['stylelint-order'], //stylelint-order插件会为css属性排序
  rules: {
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
    'order/properties-order': ['width', 'height'],
  },
};
