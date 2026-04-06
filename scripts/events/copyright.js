var fs = require('fs');
var path = require('path');

// 参照：https://blog.d77.xyz/archives/1dc407.html
hexo.extend.filter.register('before_post_render', function(data){

    // 只对文章生效
    if (data.layout !== 'post') return data;

    if (data.copyright === false) {
        return data;
    }

    try {
        // 正确路径：blog-delta/source/copyright.md
        var file_path = path.join(hexo.base_dir, 'source', 'copyright.md');
        var file_content = fs.readFileSync(file_path, 'utf8');
        var permalink = data.permalink;

        // 渲染 markdown
        const link = `[${permalink}](${permalink})`;
        var copyright_html = hexo.render.renderSync({
            text: file_content + link,
            engine: 'markdown'
        });

        // 将渲染后的版权信息拼接到文章末尾
        data.content += copyright_html;

    } catch (err) {}

    return data;
});