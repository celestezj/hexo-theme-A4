'use strict';

// 纯图片注释插件：只输出文字，用于图片下方说明
// 用法：
// {% cap center 这是图片注释，居中显示 %}
// {% cap left 这是图片注释，靠左显示 %}
function captionTag(args) {
  if (args.length === 0) return '';

  const align = args[0]; // center / left
  const text = args.slice(1).join(' ');

  if (align !== 'center' && align !== 'left') {
    // 没写对齐方式，默认居中
    return `<div class="img-caption">${args.join(' ')}</div>`;
  }

  return `<div class="img-caption img-caption-${align}">${text}</div>`;
}

hexo.extend.tag.register('cap', captionTag);