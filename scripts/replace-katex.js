'use strict'

// 只清理、替换 hexo-math 注入的 CSS，100% 安全
hexo.extend.filter.register('after_render:html', function(html) {
  const isLocal = hexo.theme.config.no_internet_local_deploy

  // ✅ 拦截：只有开启本地模式才执行替换
  if (!isLocal) {
    return html
  }

  // 1. 精准删除 hexo-math 自动注入的两行 CSS
  html = html.replace(/<link rel="stylesheet" href="https:\/\/cdn\.jsdelivr\.net\/npm\/katex@0\.12\.0\/dist\/katex\.min\.css">/g, '')
  html = html.replace(/<link rel="stylesheet" href="https:\/\/cdn\.jsdelivr\.net\/npm\/hexo-math@4\.0\.0\/dist\/style\.css">/g, '')

  // 2. 插入我们自己控制的正确版本（本地 / CDN）
  const customCSS = `
<link rel="stylesheet" href="${isLocal ? '/libs/katex/katex.min.css' : 'https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css'}">
<link rel="stylesheet" href="${isLocal ? '/libs/mathjax/style.css' : 'https://cdn.jsdelivr.net/npm/hexo-math@4.0.0/dist/style.css'}">`

  // 插入到 </head> 前面
  html = html.replace('</head>', customCSS + '\n</head>')

  return html
})