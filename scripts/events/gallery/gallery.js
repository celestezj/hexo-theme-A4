hexo.config.lightgallery = Object.assign({
    js: '../../../js/lightgallery.min.js',
    css: '../../../css/lightgallery.min.css',
    plugins: {},
}, hexo.config.lightgallery);

if (hexo.config.lightgallery.enable) {
    // console.log('✅ lightgallery 已启用');
    
    // 只有开启时，才注册渲染过滤器
    const renderer = require('./renderer');
    hexo.extend.filter.register('after_post_render', renderer.render, 9);
} else {
    // console.log('❌ lightgallery 已关闭');
}