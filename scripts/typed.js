/* 'use strict'
 {% typed id, loop, [typespeed] [backspeed] [startdelay] [backdelay] %}
 纠正一个<font color='red'>错误</font>的方法有很多
 而<font color='blue'>解决</font>一个错误的终极方法，就是不给它发生的机会。
 {% endtyped %}
*/

'use strict'

function typed(args, content) {
  // 🔥 正确获取 hexo 配置方式，永远不报错
  const enableTyped = hexo.theme.config.typed_printer || false;

  // 未启用 → 直接返回原文
  if (!enableTyped) {
    return content;
  }
  args = args.join(' ').split(',')
  let id = (args[0] || 'typed_default').trim()
  let loop = (args[1] || 'true').trim()
  let prop = args[2] ? args[2].trim().split(' ') : []

  let typespeed = prop[0] ? parseInt(prop[0]) : 100
  let backspeed = prop[1] ? parseInt(prop[1]) : 50
  let startdelay = prop[2] ? parseInt(prop[2]) : 200
  let backdelay = prop[3] ? parseInt(prop[3]) : 2000

  let textLines = content.split("\n")
    .map(s => s.trim())
    .filter(Boolean)
  let text = JSON.stringify(textLines)

return `
<span class="${id}"></span>
<script>
// 每个实例独立封装，支持多实例共存
window.initTyped_${id} = function() {
  const typedKey  = '__typed_${id}';
  const selector  = '.${id}';

  // 1. 销毁旧实例
  if (window[typedKey]) {
    try { window[typedKey].destroy(); } catch(e) {}
    delete window[typedKey];
  }

  const $el = document.querySelector(selector);
  if (!$el) return;

  // 2. 🔥 只删除【当前元素后面】的光标（安全！不影响其他实例）
  const nextEl = $el.nextElementSibling;
  if (nextEl && nextEl.classList.contains('typed-cursor')) {
    nextEl.remove();
  }

  // 3. 重新创建
  window[typedKey] = new Typed($el, {
    strings: ${text}, //输入内容, 支持html标签
    typeSpeed: ${typespeed}, //打字速度
    backSpeed: ${backspeed}, //回退速度
    startDelay: ${startdelay}, //开始打字前的延迟
    backDelay: ${backdelay}, //回退前的延迟
    loop: ${loop} //循环
  });
};

// 立即执行
window.initTyped_${id}();
</script>`
}

hexo.extend.tag.register('typed', typed, { ends: true });