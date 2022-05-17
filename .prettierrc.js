// prettier格式化代码配置，更多配置可查看官网
// https://prettier.io/docs/en/options.html

// 如果prettier中设置的属性和.editorconfig冲突了，以.editorconfig优先
module.exports = {
  printWidth: 100, // 最大行长
  semi: true, // 语句结尾加上分号
  vueIndentScriptAndStyle: true, // 是否缩进Vue文件中的<script>和<style>标签内的代码
  singleQuote: true, // 单引号
  trailingComma: 'all', // 在多行逗号分隔的语法结构中，打印尾随逗号
  proseWrap: 'never',
  htmlWhitespaceSensitivity: 'strict', // 所有空格都被认为是重要的，不会随意格式化
  endOfLine: 'auto', // 因为git提交时会自动把换行类型CRLF 替换为 LF，拉取代码时又会把LF 替换为 CRLF，所以设置成auto，则不会有错误提示
};
