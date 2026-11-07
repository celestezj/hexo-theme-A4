'use strict'

const escapeRegExp = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// 只清理、替换 hexo-math 注入的 CSS，100% 安全
hexo.extend.filter.register('after_render:html', function(html) {
  const isLocal = hexo.theme.config.no_internet_local_deploy

  // ✅ 拦截：只有开启本地模式才执行替换
  if (!isLocal) {
    return html
  }

  // 1. 精准删除 hexo-math 自动注入的 CSS（URL 以 _config.yml 中 math.*.css 为准）
  const { katex, mathjax } = hexo.config.math || {}
  for (const css of [katex && katex.css, mathjax && mathjax.css]) {
    if (!css) continue
    const re = new RegExp(`<link rel="stylesheet" href="${escapeRegExp(css)}">`, 'g')
    html = html.replace(re, '')
  }

  // 2. 插入我们自己控制的正确版本（本地）
  const customCSS = `
<link rel="stylesheet" href="/libs/katex/katex.min.css">
<link rel="stylesheet" href="/libs/mathjax/style.css">`

  // 插入到 </head> 前面
  html = html.replace('</head>', customCSS + '\n</head>')

  return html
})