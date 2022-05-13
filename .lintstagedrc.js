// lint-staged配置：在commit之前，执行自动修复

module.exports = {
  // 执行eslint修复以及prettier格式化
  '*.{js,jsx,ts,tsx,d.ts}': ['eslint --fix', 'prettier --write'],
  '*.vue': ['eslint --fix', 'stylelint --fix', 'prettier --write'],
  '*.{css,less,html}': ['stylelint --fix', 'prettier --write'],
  '*.md': ['prettier --write'],
  'package.json': ['prettier --write'],
};
