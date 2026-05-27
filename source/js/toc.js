$(document).ready(function() {
  var headings = ["h1","h2","h3","h4","h5","h6"];
  //var tocHeading = headings.filter(h => $(h).length > 1).join(",");
  var tocHeading = headings.filter(h => $(h).length > 0).join(",");

  var $hs = $(tocHeading);

  // ===============================
  // 只临时删除【每个标题的最后一个 span】（H1/H2/H3/H4 后缀）
  // ===============================
  $hs.each(function() {
    var $h = $(this);
    // 找到当前标题内部 最后一个 span
    var $lastSpan = $h.find("span").last();

    if ($lastSpan.length) {
      // 保存旧内容
      $lastSpan.data("oldText", $lastSpan.text());
      // 清空文字（不删标签，不影响图片）
      $lastSpan.text("");
    }
  });

  // 初始化 TOC
  $("#toc").tocify({
    selectors: tocHeading,
    hashGenerator: function(text) {
      return text.trim().replace(/\s+/g, "-");
    }
  });

  // ===============================
  // 恢复最后一个 span 的文字
  // ===============================
  $hs.each(function() {
    var $h = $(this);
    var $lastSpan = $h.find("span").last();

    if ($lastSpan.length) {
      var oldText = $lastSpan.data("oldText");
      if (oldText) {
        $lastSpan.text(oldText);
      }
    }
  });
});