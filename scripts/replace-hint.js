'use strict'

// 替换 hint.css 的 CDN 链接为本地路径
hexo.extend.filter.register('after_render:html', function(html) {
  const isLocal = hexo.theme.config.no_internet_local_deploy

  // 只在本地模式下替换 hint.css
  if (isLocal) {
    // 匹配并替换所有 hint.css CDN 链接
    html = html.replace(
      /https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/hint\.css\/2\.7\.0\/hint\.min\.css/g,
      '/css/hint.min.css'
    )
  }

  return html
})