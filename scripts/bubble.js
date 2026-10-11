'use strict';

/**
 * Hexo bubble 标签插件（气泡注释，hover 弹出带小尾巴的注释）
 * 移植自 Butterfly bubble.js（https://github.com/celestezj/Butterfly_3.7.0/tree/master/scripts/tag/bubble.js）
 * 用法：{% bubble [content] ,[notation] ,[background-color] %}
 * 颜色缺省为 #71a4e3；动画/形状全由 custom.css 的 .bubble-* 类实现（纯 CSS，无 JS 运行时）。
 */

function bubble(args) {
  args = args.join(' ').split(',');
  const content = args[0];
  const notation = args[1];
  const color = args[2] ? args[2].trim() : '#71a4e3';

  return `<span class="bubble-content">${content}</span><span class="bubble-notation"><span class="bubble-item" style="background-color:${color};">${notation}</span></span>`;
}

hexo.extend.tag.register('bubble', bubble);