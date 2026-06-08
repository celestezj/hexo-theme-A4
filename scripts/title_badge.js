hexo.extend.filter.register('after_render:html', function (html) {
  const js = `
<script>
function addHeaderMark() {
  // 去重：避免 PJAX 多次执行重复加 span
  document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(h => {
    // 如果已经有我们加的 mark，就跳过
    if (h.querySelector('.header-level-mark')) return;

    const level = h.tagName;
    const mark = document.createElement('span');
    mark.className = 'header-level-mark'; // 标记，用于去重
    mark.textContent = ' ' + level;
    mark.style = 'color:#ddd; font-size:0.6em; font-weight:normal;';
    h.appendChild(mark);
  });
}

// 首次整页加载
document.addEventListener('DOMContentLoaded', function() {
  console.log("init header mark");
  addHeaderMark();
});

// 暴露到全局，供 PJAX 调用
window.addHeaderMark = addHeaderMark;

</script>
</body>
`;
  return html.replace('</body>', js);
});