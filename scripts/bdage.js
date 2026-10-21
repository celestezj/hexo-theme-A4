'use strict';

/**
 * Hexo bdage 标签插件（shields.io 徽标）
 * 移植自 Butterfly ghbdage.js（https://github.com/celestezj/Butterfly_3.7.0/）
 * 用法：{% bdage [right],[left],[logo]||[color],[link],[title]||[option] %}
 */

function bdage(args) {
  args = args.join(' ').split('||');

  const base = args[0] ? args[0].split(',') : [];
  const rightRaw = base[0] ? base[0].trim() : '';
  const leftRaw = base[1] ? base[1].trim() : '';
  const logo = base[2] ? base[2].trim() : '';
  const right = encodeURI(rightRaw);
  const left = encodeURI(leftRaw);

  const message = args[1] ? args[1].split(',') : [];
  const color = message[0] ? message[0].trim() : 'orange';
  const link = message[1] ? message[1].trim() : '';
  const title = message[2] ? message[2].trim() : '';

  const option = args[2] ? args[2].trim() : '';

  const params = [];
  if (logo) params.push(`logo=${logo}`);
  params.push(`color=${color}`);
  if (option) params.push(option);
  const query = params.join('&');
  const src = `https://img.shields.io/badge/${left}-${right}-${color}?${query}`;

  // 固定高度 20px：远程 SVG 加载中/失败时不再退回 <object> 默认的 300x150 空白
  // onerror：失败时带时间戳重试一次，仍失败则隐藏，避免永久裂图
  const img = `<img class="ghbdage" src="${src}" alt="${leftRaw} ${rightRaw}" title="${title}" loading="lazy" style="margin-inline:5px;height:20px;display:inline-block;vertical-align:middle" onerror="if(!this.dataset.retried){this.dataset.retried=1;this.src=this.src+'&_='+Date.now()}else{this.style.visibility='hidden'}">`;

  return link
    ? `<a href="${link}" target="_blank" rel="noopener" style="box-shadow:none">${img}</a>`
    : img;
}

hexo.extend.tag.register('bdage', bdage);
