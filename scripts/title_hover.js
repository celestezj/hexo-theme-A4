hexo.extend.filter.register('after_render:html', function(html) {
  // 给所有标题加 hover 提示
  const script = `
<script>
document.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach(el => {
  const level = el.tagName.toLowerCase();
  const text = {
    h1: '一级标题 H1',
    h2: '二级标题 H2',
    h3: '三级标题 H3',
    h4: '四级标题 H4',
    h5: '五级标题 H5',
    h6: '六级标题 H6'
  }[level];
  el.setAttribute('title', text);
});
</script>
`;
  // 插入到 </body> 之前
  return html.replace('</body>', script + '</body>');
});