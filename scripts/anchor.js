/**
 * Hexo 稳定锚点标签（不被主题篡改）
 * 用法：{% anchor 锚点名称 %}
 * 输出：<span id="锚点名称"></span>
 */

'use strict';

function anchor(args) {
  const id = args[0];
  if (!id) return '';

  // 用 span 绝对不会被主题转成链接 ✅
  return `<span id="${id}"></span>`;
}

hexo.extend.tag.register('anchor', anchor);