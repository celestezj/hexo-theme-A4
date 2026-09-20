var fs = require('fs');
var path = require('path');

// 参照：https://blog.d77.xyz/archives/1dc407.html
// 必须在 after_post_render 注入：此时 content 已是最终 HTML，
// 若在 before_post_render（原始 markdown）阶段拼接版权块，
// 当文章结尾是列表/代码块且无空行时，版权 <blockquote> 会被误当作列表项延伸而缩进。
hexo.extend.filter.register('after_post_render', function(data){

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