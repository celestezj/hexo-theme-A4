'use strict';

/**
 * Hexo 媒体标签插件（video / group_videos / audio）
 * 移植自 Butterfly media.js
 *
 * 网格标签命名为 group_videos 而非 Butterfly 原版的 videos：
 * Hexo 7 用 str.includes('end'+tag) 判定块标签，endvideos 含子串 endvideo，
 * 会误把行内 {% video %} 当成块标签去吞标题/其它标签。
 * group_videos → endgroup_videos 不含 endvideo，无此冲突。渲染类名仍为 .videos。
 *
 * 用法：
 *   {% video src %}                       单视频（满宽居中）
 *   {% video src, [width], [align] %}     单视频（width 为相对单位，align 为 center/left/right）
 *   {% audio src %}                       单音频
 *   {% audio src, [width], [align] %}     单音频
 *   {% group_videos [class], [col] %}     视频网格（配合 {% video %} 使用）
 *       {% video 视频1 %}
 *       {% video 视频2 %}
 *   {% endgroup_videos %}
 *
 * 宽度/对齐仅作用于独立单视频/单音频外层容器；grid 子项由 postVideos 剥离
 * 这些参数，仍由列编排控制（见 postVideos）。
 */

// 相对单位白名单（百分比 / em / rem / vw / vh / vmin / vmax），拒绝固定 px 等
const REL_UNIT = /^\d+(\.\d+)?(em|rem|vw|vh|vmin|vmax|%)$/;
const ALIGNS = ['left', 'center', 'right'];

function relUnit(val) {
  return val && REL_UNIT.test(val) ? val : '';
}

function validAlign(val) {
  return ALIGNS.includes(val) ? val : '';
}

// 组装单媒体外层容器；未给宽度/对齐时保持旧输出（class 不带修饰）
function mediaWrapper(type, inner, width, align) {
  if (!width && !align) return `<div class="${type}">${inner}</div>\n\n`;
  const a = align || 'center';
  const style = width ? ` style="width:${width}"` : '';
  return `<div class="${type} ${a}"${style}>${inner}</div>\n\n`;
}

function postVideo(args) {
  // Hexo 按空白切分 args，逗号会粘在前一 token 上；先 join 再按逗号切分还原 src,width,align
  args = args.join(' ').split(',');
  const src = args[0] ? args[0].trim() : '';
  if (!src) return '';
  const width = relUnit(args[1] && args[1].trim());
  const align = validAlign(args[2] && args[2].trim());
  const inner = `<video controls preload><source src='${src}' type='video/mp4'>Your browser does not support the video tag.</video>`;
  return mediaWrapper('video', inner, width, align);
}

function postAudio(args) {
  args = args.join(' ').split(',');
  const src = args[0] ? args[0].trim() : '';
  if (!src) return '';
  const width = relUnit(args[1] && args[1].trim());
  const align = validAlign(args[2] && args[2].trim());
  const inner = `<audio controls preload><source src='${src}' type='audio/mp3'>Your browser does not support the audio tag.</audio>`;
  return mediaWrapper('audio', inner, width, align);
}

function postVideos(args, content) {
  // 剥离子标签的宽度/对齐参数，保证网格内单视频参数不生效，仍由列编排布局
  content = content
    .replace(/{%\s*video\b([^}]*?)(?:,\s*[^}]*?)?%}/g, '{% video$1 %}')
    .replace(/{%\s*audio\b([^}]*?)(?:,\s*[^}]*?)?%}/g, '{% audio$1 %}');
  args = args.join(' ').split(',');
  let cls = args[0];
  if (cls && cls.length > 0) cls = ' ' + cls;
  else cls = '';
  const col = Number(args[1]) || 0;
  if (col > 0) return `<div class="videos${cls}" col='${col}'>${content}</div>\n\n`;
  return `<div class="videos${cls}">${content}</div>\n\n`;
}

hexo.extend.tag.register('audio', postAudio);
hexo.extend.tag.register('video', postVideo);
hexo.extend.tag.register('group_videos', postVideos, { ends: true });