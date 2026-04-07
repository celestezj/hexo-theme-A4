hexo.extend.filter.register('after_render:html', function (html) {
  const js = `
<script>
document.addEventListener('DOMContentLoaded', function () {
  const headers = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  for (let h of headers) {
    const level = h.tagName;
    const mark = document.createElement('span');
    mark.textContent = ' ' + level;
    mark.style = 'color:#ddd; font-size:0.6em; font-weight:normal;';
    h.appendChild(mark);
  }
});
</script>
</body>
`;
  return html.replace('</body>', js);
});