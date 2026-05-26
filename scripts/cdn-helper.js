/**
 * CDN Helper for Hexo Theme A4
 * 统一管理CDN资源加载，支持多CDN提供商切换
 */

'use strict';

/**
 * 获取CDN基础URL
 * @param {Object} themeConfig - 主题配置
 * @returns {Object} 包含baseUrl, themePath的对象
 */
function getCdnBase(themeConfig) {
  const cdnConfig = themeConfig.cdn || {};
  const provider = cdnConfig.provider || 'statically';
  const providers = cdnConfig.providers || {};

  // 获取当前提供商配置
  const providerConfig = providers[provider] || providers['statically'] || {};

  return {
    baseUrl: providerConfig.baseUrl || '',
    themePath: providerConfig.themePath || '',
    provider: provider
  };
}

/**
 * 构建主题资源URL
 * @param {string} path - 资源路径（如: css/style.css）
 * @param {Object} cdnBase - CDN基础配置
 * @returns {string} 完整URL
 */
function buildThemeUrl(path, cdnBase) {
  if (!cdnBase.baseUrl) {
    return '/' + path;
  }
  // 确保路径不以/开头
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  return `${cdnBase.baseUrl}/${cdnBase.themePath}/${cleanPath}`;
}

/**
 * 构建第三方库URL
 * @param {string} libName - 库名称（对应cdn.libs配置）
 * @param {Object} themeConfig - 主题配置
 * @returns {string|null} 库URL
 */
function buildLibUrl(libName, themeConfig) {
  const libs = themeConfig.resources.libs || {};
  const lib = libs[libName];

  if (!lib || !lib.url) {
    return null;
  }

  // 核心：判断是否无网络本地部署
  const noInternet = themeConfig.no_internet_local_deploy;
  
  // 如果开启本地模式 + 存在 local_url → 使用本地地址
  if (noInternet && lib.local_url) {
    return lib.local_url; //return hexo.extend.helper.get('url_for').call(hexo, lib.local_url);
  }

  // 否则正常返回线上 CDN 地址
  return lib.url;
}

/**
 * Hexo辅助函数注册
 */
hexo.extend.helper.register('cdn_theme_url', function(path) {
  const cdnBase = getCdnBase(this.theme);
  return buildThemeUrl(path, cdnBase);
});

hexo.extend.helper.register('cdn_lib_url', function(libName) {
  return buildLibUrl(libName, this.theme);
});

hexo.extend.helper.register('cdn_base', function() {
  return getCdnBase(this.theme);
});

hexo.extend.helper.register('is_cdn_enabled', function() {
  if (this.theme.no_internet_local_deploy) {
    return false;
  }
  return !!(this.theme.cdn?.enable && this.theme.cdn?.provider);
});

/**
 * 获取配置中的数组
 * 用于从theme.cdn.theme.css/js等配置中获取列表
 * @param {Array} data - 配置中的数组数据
 * @returns {Array} 返回数组（如果数据无效则返回空数组）
 */
hexo.extend.helper.register('get_list_from_config', function(data) {
  let dataList = [];

  if (Array.isArray(data) && data.length > 0) {
    dataList = data;
  } else if (data && typeof data === 'string') {
    dataList = [data];
  }
  return dataList.filter(item => item && item.trim() !== '');
});

hexo.extend.tag.register('iflocal', function (args, content) {
  const local = hexo.theme.config.no_internet_local_deploy || false;
  if (local) {
    // 渲染 content 为 markdown
    return hexo.render.renderSync({ text: content, engine: 'markdown' });
  }
  return '';
}, { ends: true });

hexo.extend.tag.register('ifonline', function (args, content) {
  const local = hexo.theme.config.no_internet_local_deploy || false;
  if (!local) {
    // 渲染 content 为 markdown
    return hexo.render.renderSync({ text: content, engine: 'markdown' });
  }
  return '';
}, { ends: true });

// 导出供其他脚本使用
module.exports = {
  getCdnBase,
  buildThemeUrl,
  buildLibUrl
};
