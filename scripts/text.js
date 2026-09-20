/**
 * 自定义 Hexo 标签插件合集
 * 包含：ruby / kbd / sub / sup / underline / emp / wavy
 * 用法极简，全部支持 Markdown 嵌套
 */

'use strict';

// ------------------------------
// 1. 注音标签 {% ruby 文字|注音 %}
// ------------------------------
hexo.extend.tag.register('ruby', function (args) {
  const content = args.join(' ').split('|');
  const text = content[0] || '';
  const rt = content[1] || '';
  return `<ruby>${text}<rp> (</rp><rt>${rt}</rt><rp>)</rp></ruby>`;
});

// ------------------------------
// 2. 键盘标签 {% kbd 按键 %}
// ------------------------------
hexo.extend.tag.register('kbd', function (args) {
  const key = args.join(' ');
  return `<kbd>${key}</kbd>`;
});

// ------------------------------
// 3. 下标 {% sub 主体, 下标 %}  👉 你要的格式
// ------------------------------
hexo.extend.tag.register('sub', function (args) {
  const [main, sub] = args.join(' ').split(',').map(item => item.trim());
  return `${main}<sub>${sub}</sub>`;
});

// ------------------------------
// 4. 上标 {% sup 主体, 上标 %}  👉 你要的格式
// ------------------------------
hexo.extend.tag.register('sup', function (args) {
  const [main, sup] = args.join(' ').split(',').map(item => item.trim());
  return `${main}<sup>${sup}</sup>`;
});

// ------------------------------
// 5. 下划线 {% underline 文字 %}
// ------------------------------
hexo.extend.tag.register('underline', function (args) {
  const text = args.join(' ');
  return `<span alt="underline">${text}</span>`;
});

// ------------------------------
// 6. 着重号 {% emp 文字 %}
// ------------------------------
hexo.extend.tag.register('emp', function (args) {
  const text = args.join(' ');
  return `<span alt="emp">${text}</span>`;
});

// ------------------------------
// 7. 波浪线 {% wavy 文字 %}
// ------------------------------
hexo.extend.tag.register('wavy', function (args) {
  const text = args.join(' ');
  return `<span alt="wavy">${text}</span>`;
});

// ---------------------------------------------------------------------------
// 让行内单标签在【段落开头】也能用
//
// 背景：hexo 在渲染 markdown 前，会把所有 {% tag %} 逃逸成 HTML 注释占位符
// (<!--swig〇0-->)。若该占位符顶在段落开头，marked 会把它当成 raw HTML block，
// 导致这一整段的后续 markdown（链接、粗体、代码）全部原样输出、不再解析。
// 而段中 tag 因为前面有普通文本，不会触发，所以"段中正常、段首崩"。
//
// 解法：在 before_post_render（早于 swig 逃逸）里，把上方这些行内单标签
// 提前直接生成 HTML。这样它们不进入逃逸，段首的 <span> 是行内元素，
// marked 照常解析其后的 markdown。原 {% xxx %} 语法不变。
//
// 注意：这里兜底了围栏代码块，避免其中的 {% %} 字面量被误转换。
// 它是"inline 版"的补充；若未来有 {% xxx %}...{% endxxx %} 块级用法，
// 会走 hexo 原生的 nunjucks tag.render 路径（仍只支持段中）。
// ---------------------------------------------------------------------------
const INLINE_TAG_RE = /\{%\s*(ruby|kbd|sub|sup|underline|emp|wavy)\s+((?:(?!%\})[\s\S])+?)\s*%\}/g;
// 保护围栏代码块，避免其中的 {% %} 字面量被误转换
const FENCE_RE = /```[\s\S]*?(?:```|$)|~~~[\s\S]*?(?:~~~|$)/g;

hexo.extend.filter.register('before_post_render', function (data) {
  if (!data || typeof data.content !== 'string') return data;

  const fences = [];
  const fenced = data.content.replace(FENCE_RE, function (m) {
    fences.push(m);
    return 'A4FENCE0' + (fences.length - 1) + '0FENCE';
  });

  const out = fenced.replace(INLINE_TAG_RE, function (match, tag, args) {
    const argStr = args.trim();
    switch (tag) {
      case 'ruby': {
        const [text, rt] = argStr.split('|');
        return `<ruby>${(text || '').trim()}<rp> (</rp><rt>${(rt || '').trim()}</rt><rp>)</rp></ruby>`;
      }
      case 'kbd': return `<kbd>${argStr}</kbd>`;
      case 'sub': {
        const [main, sub] = argStr.split(',').map(s => s.trim());
        return `${main}<sub>${sub || ''}</sub>`;
      }
      case 'sup': {
        const [main, sup] = argStr.split(',').map(s => s.trim());
        return `${main}<sup>${sup || ''}</sup>`;
      }
      case 'underline': return `<span alt="underline">${argStr}</span>`;
      case 'emp': return `<span alt="emp">${argStr}</span>`;
      case 'wavy': return `<span alt="wavy">${argStr}</span>`;
    }
    return match;
  });

  data.content = out.replace(/A4FENCE0(\d+)0FENCE/g, function (_, i) {
    return fences[i];
  });
  return data;
});