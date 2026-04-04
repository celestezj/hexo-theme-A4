/**
 * 行间公式标签 displaymath
 * 用法：{% displaymath %} 公式 {% enddisplaymath %}
 */

'use strict'

function displaymath(args, content) {
  return `
  <div class="math-display">
    ${content}
  </div>
  `
}

// 注册标签
hexo.extend.tag.register('displaymath', displaymath, { ends: true })