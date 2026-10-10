'use strict';

/**
 * Hexo bdage 标签插件（shields.io 徽标）
 * 移植自 Butterfly ghbdage.js（https://github.com/celestezj/Butterfly_3.7.0/）
 * 用法：{% bdage [right],[left],[logo]||[color],[link],[title]||[option] %}
 */

function bdage(args) {
  args = args.join(' ').split('||');

  const base = args[0] ? args[0].split(',') : [];
  const right = base[0] ? encodeURI(base[0].trim()) : '';
  const left = base[1] ? encodeURI(base[1].trim()) : '';
  const logo = base[2] ? base[2].trim() : '';

  const message = args[1] ? args[1].split(',') : [];
  const color = message[0] ? message[0].trim() : 'orange';
  const link = message[1] ? message[1].trim() : '';
  const title = message[2] ? message[2].trim() : '';

  const option = args[2] ? args[2].trim() : '';

  const params = [];
  if (logo) params.push(`logo=${logo}`);
  params.push(`color=${color}`);
  if (link) params.push(`link=${link}`);
  if (option) params.push(option);
  const query = params.join('&');

  return `<object class="ghbdage" style="margin-inline:5px" title="${title}" standby="loading..." data="https://img.shields.io/badge/${left}-${right}-${color}?${query}"></object>`;
}

hexo.extend.tag.register('bdage', bdage);