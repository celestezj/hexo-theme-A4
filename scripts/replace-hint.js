'use strict'

// 替换 hint.css 的 CDN 链接：
// 无网络本地模式 -> 本地路径；否则若配置了 hexo_reference_new_hint_min_css_replace -> 该快速 CDN
hexo.extend.filter.register('after_render:html', function(html) {
  const themeConfig = hexo.theme.config
  const HINT_CDN_RE =
    /https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/hint\.css\/2\.7\.0\/hint\.min\.css/g

  if (themeConfig.no_internet_local_deploy) {
    return html.replace(HINT_CDN_RE, '/css/hint.min.css')
  }

  const replacement = themeConfig.hexo_reference_new_hint_min_css_replace
  if (replacement) {
    return html.replace(HINT_CDN_RE, replacement)
  }

  return html
})