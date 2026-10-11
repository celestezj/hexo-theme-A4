'use strict';

/**
 * Hexo bilibili 标签插件（哔哩哔哩视频嵌入）
 * 由 A4 主题 .vscode/a4-tags.code-snippets 中「A4 Bilibili」写法改造成标签插件
 * 用法：{% bilibili src %}
 *   src 形如 https://player.bilibili.com/player.html?bvid=BVxxxxxx
 *   自动追加 page=1&as_wide=1&high_quality=1&danmaku=0&autoplay=0
 */

function bilibili(args) {
  const src = args[0] ? args[0].trim() : '';
  if (!src) return '';
  const url = `${src}&page=1&as_wide=1&high_quality=1&danmaku=0&autoplay=0`;
  return `<div class="bilibili" style="position: relative; padding: 30% 45%;"><iframe style="position: absolute; width: 100%; height: 100%; left: 0; top: 0;" src="${url}" frameborder="no" scrolling="no"></iframe></div>`;
}

hexo.extend.tag.register('bilibili', bilibili);