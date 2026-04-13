/**
 * details 折叠面板标签插件
 * 适配原生 <details> <summary> 结构
 * 用法：
 * {% details 标题 %}
 * 内容（支持markdown）
 * {% enddetails %}
 */

'use strict';

function postDetails(args, content) {
  // 标题
  const summary = args.join(' ');
  
  return `
<details>
  <summary>${summary}</summary>
  ${hexo.render.renderSync({ text: content, engine: 'markdown' })}
</details>
  `;
}

// 注册标签
hexo.extend.tag.register('details', postDetails, { ends: true });