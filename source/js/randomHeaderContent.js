// 封装成函数，方便 PJAX 调用
function randomHeaderText() {
  // 先判断元素是否存在，防止报错
  if ($('#hiddenHeaderContentArray').length === 0) return;
  if ($('#targetSpan').length === 0) return;

  // 获取随机内容
  var spans = $('#hiddenHeaderContentArray span');
  if (spans.length === 0) return;

  var randomIndex = Math.floor(Math.random() * spans.length);
  var randomText = spans.eq(randomIndex).text();

  // 赋值
  $('#targetSpan').text(randomText);
}

// 1. 首次页面加载执行
$(document).ready(function() {
//   console.log("init random header");
  randomHeaderText();
});

// 暴露到全局，供 PJAX 调用
window.randomHeaderText = randomHeaderText;