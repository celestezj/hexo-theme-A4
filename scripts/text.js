/**
 * 自定义 Hexo 标签插件合集
 * 包含：ruby / kbd / sub / sup / underline / emp / wavy
 * 用法极简，全部支持 Markdown 嵌套
 */

'use strict';

// ------------------------------
// 1. 注音标签 {% ruby 文字|注音 %}
// ------------------------------
hexo.extend.tag.register('ruby', function (args) {
  const content = args.join(' ').split('|');
  const text = content[0] || '';
  const rt = content[1] || '';
  return `<ruby>${text}<rp> (</rp><rt>${rt}</rt><rp>)</rp></ruby>`;
});

// ------------------------------
// 2. 键盘标签 {% kbd 按键 %}
// ------------------------------
hexo.extend.tag.register('kbd', function (args) {
  const key = args.join(' ');
  return `<kbd>${key}</kbd>`;
});

// ------------------------------
// 3. 下标 {% sub 主体, 下标 %}  👉 你要的格式
// ------------------------------
hexo.extend.tag.register('sub', function (args) {
  const [main, sub] = args.join(' ').split(',').map(item => item.trim());
  return `${main}<sub>${sub}</sub>`;
});

// ------------------------------
// 4. 上标 {% sup 主体, 上标 %}  👉 你要的格式
// ------------------------------
hexo.extend.tag.register('sup', function (args) {
  const [main, sup] = args.join(' ').split(',').map(item => item.trim());
  return `${main}<sup>${sup}</sup>`;
});

// ------------------------------
// 5. 下划线 {% underline 文字 %}
// ------------------------------
hexo.extend.tag.register('underline', function (args) {
  const text = args.join(' ');
  return `<span alt="underline">${text}</span>`;
});

// ------------------------------
// 6. 着重号 {% emp 文字 %}
// ------------------------------
hexo.extend.tag.register('emp', function (args) {
  const text = args.join(' ');
  return `<span alt="emp">${text}</span>`;
});

// ------------------------------
// 7. 波浪线 {% wavy 文字 %}
// ------------------------------
hexo.extend.tag.register('wavy', function (args) {
  const text = args.join(' ');
  return `<span alt="wavy">${text}</span>`;
});