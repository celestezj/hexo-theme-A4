'use strict';
/*
{% img https://a.png %}
{% img https://a.png, (300,) %}
{% img https://a.png, (,200) %}
{% img https://a.png, (300,200) %}
{% img https://a.png, (300,), center %}
{% img https://a.png, (,), center %}
{% img https://a.png, (24,24), inline %}
{% img https://a.png, (300,), center, link=https://xxx.com %}

PS：宽高支持px像素和%百分比
*/

function img(args) {
  let text = args.join(' ').trim();
  let width = '';
  let height = '';
  let className = '';
  let linkUrl = '';

  // 1. 提取宽高 (w,h)
  const sizeMatch = text.match(/\(\s*(\S*?)\s*,\s*(\S*?)\s*\)/);
  if (sizeMatch) {
    width = sizeMatch[1].trim();
    height = sizeMatch[2].trim();
    text = text.replace(sizeMatch[0], '').trim();
  }

  // 2. 按逗号拆分所有参数
  const parts = text.split(',').map(i => i.trim()).filter(Boolean);

  // 3. 提取图片src
  const src = parts.shift() || '';

  // 4. 遍历剩余参数：识别 link=xxx / class
  for(let p of parts){
    if(p.startsWith('link=')){
      linkUrl = p.replace('link=','').trim();
    }else{
      // 剩下的当作 class
      className = p;
    }
  }

  // 5. 拼接 img 行内样式（防CSS覆盖宽高）
  const style = [];
  if (width) style.push(`width: ${width}`);
  if (height) style.push(`height: ${height}`);

  let imgAttrs = [`src="${src}"`];
  if (className) imgAttrs.push(`class="${className}"`);
  if (style.length) imgAttrs.push(`style="${style.join('; ')}; max-width: none !important;"`);

  let imgHtml = `<img ${imgAttrs.join(' ')}>`;

  // 6. 如果有链接，包 a 标签
  if(linkUrl){
    // 默认新窗口打开
    imgHtml = `<a href="${linkUrl}" target="_blank" rel="noopener">${imgHtml}</a>`;
  }

  return imgHtml;
}

hexo.extend.tag.register('img', img);