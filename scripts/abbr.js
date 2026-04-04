/**
 * Hexo abbr 标签插件（逗号分隔参数）
 * 用法：{% abbr HTML, Hyper Text Markup Language %}
 * 输出：<abbr title="Hyper Text Markup Language">HTML</abbr>
 */

'use strict';

function abbr(args) {
  // 把所有参数拼回完整字符串
  const content = args.join(' ');
  
  // 按 逗号 + 空格 分割成两部分
  const [text, title] = content.split(', ');
  
  if (!text || !title) return '';

  return `<abbr title="${title.trim()}">${text.trim()}</abbr>`;
}

hexo.extend.tag.register('abbr', abbr);