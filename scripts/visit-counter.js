/**
 * 访问量统计 Helper：支持 busuanzi（不蒜子）/ vercount（Vercount）/ busuanzicc（busuanzi.cc）三种服务
 *
 * 各服务的差异全部收敛在此处：
 * - 脚本地址不同；
 * - value 元素 id 命名不同：
 *     busuanzi / vercount → <ns>_value_<metric>（如 busuanzi_value_page_pv）
 *     busuanzicc(v3.6.9)  → busuanzi_<metric>      （如 busuanzi_page_pv，无 value 中缀，
 *                            因为它用返回的 json key 直接当元素 id 精确查找）
 * - busuanzicc 的脚本用 window.busuanziRequestSent 做了「只执行一次」的守卫，
 *   pjax 重建前需复位该标志，否则站内跳转后计数不再更新。
 */

'use strict';

var PROVIDERS = ['busuanzi', 'vercount', 'busuanzicc'];

function getVisitCounterProvider(themeConfig) {
  var p = themeConfig.visit_counter_provider;
  return PROVIDERS.indexOf(p) !== -1 ? p : 'busuanzi';
}

function getVisitCounterScript(themeConfig) {
  switch (getVisitCounterProvider(themeConfig)) {
    case 'vercount': return themeConfig.vercount_js;
    case 'busuanzicc': return themeConfig.busuanzicc_js;
    default: return themeConfig.busuanzi_js;
  }
}

// value 元素 id，metric 取 'page_pv' | 'site_pv'
function getVisitCounterValueId(themeConfig, metric) {
  if (getVisitCounterProvider(themeConfig) === 'busuanzicc') {
    return 'busuanzi_' + metric;
  }
  return getVisitCounterProvider(themeConfig) + '_value_' + metric;
}

// container 元素 id（busuanzi / vercount 用于显隐；busuanzicc 不管理容器，此处仅为统一结构）
function getVisitCounterContainerId(themeConfig, metric) {
  var ns = getVisitCounterProvider(themeConfig) === 'vercount' ? 'vercount' : 'busuanzi';
  return ns + '_container_' + metric;
}

// 是否需要在 pjax 重建前复位脚本内部的一次性状态
function visitCounterNeedsReset(themeConfig) {
  return getVisitCounterProvider(themeConfig) === 'busuanzicc';
}

// 容器初始是否隐藏：vercount 的脚本加载后会先隐藏容器、待 fetch 返回再显示，
// 若容器初始可见，就会先闪出「阅读量：次」(数字为空)、随后消失约一秒再带数字出现。
// 初始即隐藏可消除该闪烁。busuanzi 起点不隐藏(成功时自行 shows())，busuanzicc
// 只写数值、从不管理容器(初始隐藏后将永不再显示)，故二者均保持可见。
function visitCounterContainerInitiallyHidden(themeConfig) {
  return getVisitCounterProvider(themeConfig) === 'vercount';
}

hexo.extend.helper.register('visit_counter_script', function () {
  return getVisitCounterScript(this.theme);
});

hexo.extend.helper.register('visit_counter_provider', function () {
  return getVisitCounterProvider(this.theme);
});

hexo.extend.helper.register('visit_counter_value_id', function (metric) {
  return getVisitCounterValueId(this.theme, metric);
});

hexo.extend.helper.register('visit_counter_container_id', function (metric) {
  return getVisitCounterContainerId(this.theme, metric);
});

hexo.extend.helper.register('visit_counter_needs_reset', function () {
  return visitCounterNeedsReset(this.theme);
});

hexo.extend.helper.register('visit_counter_hide_container', function () {
  return visitCounterContainerInitiallyHidden(this.theme);
});

module.exports = {
  getVisitCounterProvider,
  getVisitCounterScript,
  getVisitCounterValueId,
  getVisitCounterContainerId,
  visitCounterNeedsReset,
  visitCounterContainerInitiallyHidden
};
