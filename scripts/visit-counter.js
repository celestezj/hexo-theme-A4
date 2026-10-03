/**
 * 访问量统计 Helper：在 busuanzi（不蒜子）与 vercount（Vercount）之间切换
 *
 * 两者 span 标签体系互相兼容，此处统一解析「脚本地址」与「元素 id 前缀」，
 * 使 EJS 模板无需关心当前使用哪个服务，只由 _config.A4.yml 的 visit_counter_provider 决定。
 */

'use strict';

function getVisitCounterProvider(themeConfig) {
  return themeConfig.visit_counter_provider === 'vercount' ? 'vercount' : 'busuanzi';
}

function getVisitCounterScript(themeConfig) {
  return getVisitCounterProvider(themeConfig) === 'vercount'
    ? themeConfig.vercount_js
    : themeConfig.busuanzi_js;
}

// busuanzi → busuanzi_value_* / busuanzi_container_*
// vercount → vercount_value_* / vercount_container_*
function getVisitCounterIdPrefix(themeConfig) {
  return getVisitCounterProvider(themeConfig);
}

hexo.extend.helper.register('visit_counter_script', function () {
  return getVisitCounterScript(this.theme);
});

hexo.extend.helper.register('visit_counter_id_prefix', function () {
  return getVisitCounterIdPrefix(this.theme);
});

hexo.extend.helper.register('visit_counter_provider', function () {
  return getVisitCounterProvider(this.theme);
});

module.exports = {
  getVisitCounterProvider,
  getVisitCounterScript,
  getVisitCounterIdPrefix
};
