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
	function getCountDownHtml(){
		var countDownDays = Math.ceil( ( new Date(2016,9-1,28) - new Date() )/1000/60/60/24 ),
			MANY_ZEROS = "000000000000000000";

		function leftZeroPad(val, minLength) {
			if (typeof(val) != "string")
				val = String(val);
			return (MANY_ZEROS.substring(0, minLength - val.length)) + val;
		}
		function createCountDownHtml( str ){
			var arr = str.match(/./g),
				html = '';
			arr.forEach(function( num ){
				html += '<span>' + num + '</span>';
			});
			return html;
		}
		var str_day = leftZeroPad(countDownDays,3);
		
		return createCountDownHtml( str_day );

	}
	var isLoadedList = [];
	function replaceTplToSlide( index ){
		if( isLoadedList[index] ){
			return
		}
		isLoadedList[index] = true;
		var node_slide = swiper.slideList[ index ],
			node_tpl = node_slide.querySelector('.template');
		if( node_tpl ){
			node_slide.innerHTML = node_tpl.value;
			if( index == 21 ){
				var html = getCountDownHtml();
				document.querySelector('.countdown-group').innerHTML = html;
			}
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
	// 去除蒙层
	setTimeout(function(){
		var node_mask = document.querySelector('.page-mask');
		node_mask.classList.add('out');
		setTimeout(function(){
			node_mask.parentNode.removeChild( node_mask );
		},1000);
	},1500);
	// 默认播放音乐
	backgroundMusic();

	// swiper.on('slideChange',function( index ){
	// 	location.hash = index;
	// });
})();