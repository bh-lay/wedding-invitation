(function(){
	var defaultIndex = location.hash ? parseInt(location.hash.replace(/\#/,'')) - 1 : 0,
		swiper = new Swiper(document.querySelector('.pages'),{
			slideClass: 'page',
			defaultSlideIndex: defaultIndex
		}),
		node_page_num_current = document.querySelector('.page-count .current'),
		node_page_num_total = document.querySelector('.page-count .total');

	node_page_num_total.innerHTML = swiper.slideList.length;
	node_page_num_current.innerHTML = defaultIndex + 1;

	var isLoadedList = [];
	function replaceTplToSlide( index ){
		if( isLoadedList[index] ){
			return
		}
		isLoadedList[index] = true;
		var node_slide = swiper.slideList[ index ],
			node_tpl = node_slide.getElementsByTagName('script')[0];
		if( node_tpl ){
			node_slide.innerHTML = node_tpl.innerHTML;
		}
	}
	// 加载页面（一次前中后三页）
	function lazyLoad( index ){
		var length = swiper.slideList.length;
		// 加载当前页
		replaceTplToSlide( index );
		// 向前加载一页
		replaceTplToSlide( index==0 ? length - 1 : index - 1 );

		// 向后加载一页
		replaceTplToSlide( index== length - 1 ? 0 : index + 1 );
	}
	// 加载默认页面
	lazyLoad( defaultIndex );
	swiper.on('slideChange',function( index ){
		lazyLoad( index );
		node_page_num_current.innerHTML = index + 1;
	});

	// 默认播放音乐
	// backgroundMusic();

	// swiper.on('slideChange',function( index ){
	// 	location.hash = index;
	// });
})();