hexo.extend.filter.register('after_render:html', function(html) {
  const css = `
<style>
/* ------------ 核心修复：外层套一层 wrapper，让按钮永远固定 ------------ */
.highlight-container {
  position: relative !important;
}
.code-copy-btn {
  position: absolute !important;
  top: 6px !important;
  right: 10px !important;
  padding: 1px 6px;
  font-size: 11px;
  color: #555;
  background: #f7f7f7;
  border: 1px solid #ddd;
  border-radius: 2px;
  cursor: pointer;
  z-index: 99;
  user-select: none;
}
.code-copy-btn:hover {
  background: #eee;
}
</style>
  `;

  const js = `
<script>
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('figure.highlight').forEach(fig => {
    // 关键：给代码块外面套一层容器，专门用来固定按钮
    const wrapper = document.createElement('div');
    wrapper.className = 'highlight-container';
    fig.parentNode.insertBefore(wrapper, fig);
    wrapper.appendChild(fig);

    // 创建按钮
    const btn = document.createElement('button');
    btn.className = 'code-copy-btn';
    btn.textContent = 'copy';
    wrapper.appendChild(btn);

    // 复制逻辑
    btn.addEventListener('click', async () => {
      const codeEl = fig.querySelector('td.code pre');
      const text = codeEl.innerHTML
        .replace(/<br>/g, '\\n')
        .replace(/<[^>]+>/g, '')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .trim();
      await navigator.clipboard.writeText(text);
      btn.textContent = 'copied';
      setTimeout(() => btn.textContent = 'copy', 1500);
    });
  });
});
</script>
  `;

  return html
    .replace('</head>', css + '</head>')
    .replace('</body>', js + '</body>');
});