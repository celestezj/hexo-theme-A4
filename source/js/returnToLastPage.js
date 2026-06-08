

/* Please ❤ this if you like it! */



(function(o) {

	// 封装成初始化函数
    function initReturnToLast() {
        // 先清除旧事件，防止重复绑定
        o('.return-to-last-progress-wrap').off('click');
		//Scroll back to top
		// 如果页面高度等于滚动位置加上窗口的视口高度，即页面处于底部
		
		// 执行你想要的操作，比如加载更多内容
		if (!jQuery('.progress-wrap').hasClass('active-progress')) {
			jQuery('.return-to-last-progress-wrap').css('bottom', '45px');
		} else {
			jQuery('.return-to-last-progress-wrap').css('bottom', '100px');
		}
		jQuery('.return-to-last-progress-wrap').addClass('active-progress');
		
		

		jQuery('.return-to-last-progress-wrap').on('click', function(event) {
			event.preventDefault(); // 阻止链接的默认行为
			window.history.back();
   			return false;
		})
	}

	//首次加载调用
	o(document).ready(function() {
		console.log("init return to last page button");
        initReturnToLast();
    });
	// 暴露到全局，供 PJAX 调用
    window.initReturnToLast = initReturnToLast;
	
})(jQuery);