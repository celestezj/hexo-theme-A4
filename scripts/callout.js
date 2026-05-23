const cheerio = require('cheerio');

hexo.extend.filter.register('after_post_render', function(data) {
  const $ = cheerio.load(data.content, { decodeEntities: false });

  // 图标和标题映射（图标若要加粗，可以将fa替换为fa-solid）
  const calloutMap = {
    'note': { icon: '<i class="fa fa-circle-info"></i>', title: 'Note' },
    'tip': { icon: '<i class="fa fa-lightbulb"></i>', title: 'Tip' },
    'important': { icon: '<i class="fa fa-exclamation-circle"></i>', title: 'Important' },
    'warning': { icon: '<i class="fa fa-triangle-exclamation"></i>', title: 'Warning' },
    'danger': { icon: '<i class="fa fa-circle-xmark"></i>', title: 'Danger' }
  };

  $('blockquote').each((_, elem) => {
    let html = $(elem).html().trim();
    // 去除 p 标签和 br 标签
    html = html.replace(/<\/?p>/g, '').replace(/<br>/g, ' ').trim();

    const match = html.match(/^\[!(\w+)\]\s*(.*)/s);
    if (match) {
      const type = match[1].toLowerCase();
      if (!calloutMap[type]) return;

      const config = calloutMap[type];
      const content = match[2].trim();

      $(elem).replaceWith(`
        <div class="callout callout-${type}">
          <div class="callout-content">
            <div class="callout-title">
              ${config.icon}
              ${config.title}
            </div>
            <div>${content}</div>
          </div>
        </div>
      `);
    }
  });

  data.content = $.html();
  return data;
});