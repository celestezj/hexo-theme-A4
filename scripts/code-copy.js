/*
 * 代码块构建期改造（solitude 风格）
 *
 * 在 after_render:html 阶段直接改写 HTML：
 *   figure.highlight / 缩进式裸 pre → 静态包裹 .highlight-container + 顶部工具条 + 复制按钮
 * 这样首屏 render-blocking 绘制时白色样式就已匹配，避免「先黑后白」的 FOUC。
 *
 * 注入的 JS 只负责：
 *   - document 级事件委托：复制按钮点击（静态按钮、pjax/解密后新增按钮都覆盖）
 *   - 幂等兜底包装：hexo-blog-encrypt 解密后 DOM 被替换为未包裹的原始内容
 */

const path = require('path');
const cheerio = require(require.resolve('cheerio', {
  paths: [path.join(hexo.base_dir, 'node_modules')]
}));

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
function escapeAttr(s) {
  return escapeHtml(s).replace(/"/g, '&quot;');
}

function copyButtonHtml() {
  return '<button class="code-copy-btn" type="button" aria-label="复制代码">'
    + '<i class="fa-regular fa-copy"></i></button>';
}

/* 用 wrapper + 工具条包裹 figure，figcaption 标题/链接迁入工具条 */
function wrapFigure(figureHtml) {
  const $ = cheerio.load(figureHtml);
  const fig = $('figure').first();

  let titleText = '';
  let linkHref = '';
  let linkText = '';
  let linkTarget = '';
  let linkRel = '';

  const caption = fig.find('figcaption').first();
  if (caption.length) {
    const span = caption.find('span').first();
    if (span.length) titleText = span.text().trim();

    const a = caption.find('a').first();
    if (a.length) {
      linkHref = a.attr('href') || '';
      linkText = a.text().trim();
      linkTarget = a.attr('target') || '';
      linkRel = a.attr('rel') || '';
    }
    caption.remove();
  }

  const classes = (fig.attr('class') || '').split(/\s+/);
  const lang = classes.find(c => c && c !== 'highlight') || 'code';

  let toolsInner = `<span class="code-lang">${escapeHtml(lang)}</span>`;
  if (titleText) {
    toolsInner += `<span class="code-title" title="${escapeAttr(titleText)}">`
      + `${escapeHtml(titleText)}</span>`;
  }
  if (linkText) {
    let attrs = ` class="code-link" href="${escapeAttr(linkHref)}"`;
    if (linkTarget) attrs += ` target="${escapeAttr(linkTarget)}"`;
    if (linkRel) attrs += ` rel="${escapeAttr(linkRel)}"`;
    toolsInner += `<a${attrs} title="${escapeAttr(linkText)}">${escapeHtml(linkText)}</a>`;
  }

  const newFigure = $.html(fig);

  return '<div class="highlight-container">'
    + `<div class="highlight-tools codeblock-tools">${toolsInner}</div>`
    + newFigure
    + copyButtonHtml()
    + '</div>';
}

/* 缩进式裸 pre：无语言信息，工具条只显示 code */
function wrapPre(preHtml) {
  if (/class="[^"]*\bmermaid\b/.test(preHtml)) return preHtml;
  return '<div class="highlight-container">'
    + '<div class="highlight-tools codeblock-tools">'
    + '<span class="code-lang">code</span></div>'
    + preHtml
    + copyButtonHtml()
    + '</div>';
}

hexo.extend.filter.register('after_render:html', function(html) {
  // figure 整体优先匹配（一次消费，内部 pre 不会再被单独匹配）；
  // 其余 pre 为 figure 外的缩进块，mermaid 在 wrapPre 内跳过。
  // 安全性：highlight 输出的 figure 内无嵌套 figure，代码内容经 HTML 转义无字面 <pre>。
  const blockRe = /<figure class="highlight[^"]*">[\s\S]*?<\/figure>|<pre\b[^>]*>[\s\S]*?<\/pre>/g;
  html = html.replace(blockRe, m =>
    m.startsWith('<figure') ? wrapFigure(m) : wrapPre(m)
  );

  const runtime = `
<script>
(function () {
  function codeText(container) {
    var fig = container.querySelector('figure.highlight');
    var el = fig
      ? (fig.querySelector('td.code pre') || fig.querySelector('pre'))
      : container.querySelector('pre');
    return el ? el.innerText.replace(/^\\n+|\\n+$/g, '') : '';
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('.code-copy-btn');
    if (!btn) return;
    var container = btn.closest('.highlight-container');
    navigator.clipboard.writeText(codeText(container)).then(function () {
      btn.innerHTML = '<i class="fa-solid fa-check"></i>';
      setTimeout(function () {
        btn.innerHTML = '<i class="fa-regular fa-copy"></i>';
      }, 1500);
    }).catch(function () {});
  });

  // 幂等兜底：仅包裹还没有 .highlight-container 的块
  // （hexo-blog-encrypt 解密后会替换出未包裹的原始 DOM）
  function wrapCodeBlocks() {
    var blocks = document.querySelectorAll(
      'figure.highlight, .post-md pre:not(.mermaid):not(figure *)'
    );
    blocks.forEach(function (block) {
      if (block.parentNode.classList.contains('highlight-container')) return;
      var isFigure = block.tagName === 'FIGURE';
      var wrapper = document.createElement('div');
      wrapper.className = 'highlight-container';
      block.parentNode.insertBefore(wrapper, block);
      wrapper.appendChild(block);

      var lang = isFigure
        ? ([].slice.call(block.classList).find(function (c) { return c !== 'highlight'; }) || 'code')
        : 'code';
      var tools = document.createElement('div');
      tools.className = 'highlight-tools codeblock-tools';
      tools.innerHTML = '<span class="code-lang"></span>';
      tools.querySelector('.code-lang').textContent = lang;

      if (isFigure) {
        var cap = block.querySelector('figcaption');
        if (cap) {
          var titleEl = cap.querySelector('span');
          if (titleEl && titleEl.textContent.trim()) {
            var title = document.createElement('span');
            title.className = 'code-title';
            title.textContent = titleEl.textContent;
            tools.appendChild(title);
          }
          var linkEl = cap.querySelector('a');
          if (linkEl && linkEl.textContent.trim()) {
            linkEl.classList.add('code-link');
            tools.appendChild(linkEl);
          }
          cap.remove();
        }
      }
      wrapper.insertBefore(tools, block);
      wrapper.insertAdjacentHTML('beforeend',
        '<button class="code-copy-btn" type="button"><i class="fa-regular fa-copy"></i></button>');
    });
  }

  // 正常文章在构建期 filter 中已包裹；加密文章解密后 HBE 会替换出未包裹的
  // 明文 DOM，监听其解密事件补包裹（手动/缓存自动解密均派发此事件）
  window.addEventListener('hexo-blog-decrypt', function () {
    setTimeout(wrapCodeBlocks, 0);
  });
})();
</script>`;

  return html.replace('</body>', runtime + '\n</body>');
});
