// lint-staged配置

module.exports = {
  // 执行eslint修复以及prettier格式化
  '*.{js,jsx,ts,tsx}': ['eslint --fix', 'prettier --write'],
  '*.vue': ['eslint --fix', 'stylelint --fix', 'prettier --write'],
  '*.{css,less,html}': ['stylelint --fix', 'prettier --write'],
  '*.md': ['prettier --write'],
  'package.json': ['prettier --write'],
};
