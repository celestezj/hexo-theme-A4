'use strict';

/**
 * Hexo ghcard 标签插件（GitHub 用户/仓库统计卡）
 * 移植自 Butterfly ghcard.js（https://github.com/celestezj/Butterfly_3.7.0/）
 * 图片由外部服务 github-readme-stats 在浏览器看图时实时生成，需联网。
 * API 主机读主题配置 hexo.theme.config.ghcard_api，可一键自部署 Vercel 后改之。
 *
 * 用法：
 *   {% ghcard username %}                    用户卡
 *   {% ghcard username/repository %}         仓库卡
 *   {% ghcard username, theme=vue, ... %}    透传额外参数
 *   {% ghcard username, width=60%, align=center %}  布局参数（默认 center，不透传）
 */

const REL_UNIT = /^\d+(\.\d+)?(em|rem|vw|vh|vmin|vmax|%)$/;

function ghcard(args) {
  args = args.join(' ').split(',').map(s => s.trim()).filter(Boolean);
  const path = args[0];
  if (!path) return '';

  let width = '';
  let align = '';
  const extra = [];
  for (const a of args.slice(1)) {
    let m;
    if ((m = /^width=(.+)$/.exec(a))) {
      if (REL_UNIT.test(m[1])) width = m[1];
    } else if ((m = /^align=(left|center|right)$/.exec(a))) {
      align = m[1];
    } else {
      extra.push(a);
    }
  }
  if (!extra.some(p => /^show_owner=/.test(p))) extra.push('show_owner=true');

  const api = (hexo.theme.config.ghcard_api || 'https://github-readme-stats.vercel.app').replace(/\/+$/, '');
  let src;
  if (path.includes('/')) {
    const [username, repo] = path.split('/');
    src = `${api}/api/pin/?username=${username}&repo=${repo}&${extra.join('&')}`;
  } else {
    src = `${api}/api/?username=${path}&${extra.join('&')}`;
  }

  const inner = `<a class="ghcard" rel="external nofollow noopener noreferrer" href="https://github.com/${path}"><img src="${src}"/></a>`;
  if (!width && !align) return inner;
  const cls = align || 'center';
  const style = width ? ` style="width:${width}"` : '';
  return `<div class="ghcard ${cls}"${style}>${inner}</div>`;
}

hexo.extend.tag.register('ghcard', ghcard);
