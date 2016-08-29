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

    // 如果是微信环境，加载微信JS-SDK
    var script = document.createElement('script');
    script.src = '//res.wx.qq.com/open/js/jweixin-1.0.0.js';
    document.body.appendChild(script);

    script.onload = function () {
        wx.config({
	        debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
		    appId: 'wx933a202dcd5f7a76', // 必填，公众号的唯一标识
		    timestamp: new , // 必填，生成签名的时间戳
		    nonceStr: '', // 必填，生成签名的随机串
		    signature: '',// 必填，签名，见附录1
	        jsApiList: [
	            'onMenuShareTimeline', 'onMenuShareAppMessage'
	        ]
	    });
        var data = window.custom_share_data || {},
            randomNum = Math.ceil( Math.random() * 2000 ) + 2000;
        wx.onMenuShareTimeline({
            title: data.desc, // 分享标题
            link: data.bdUrl, // 分享链接
            imgUrl: data.bdPic // 分享图标
        });
        // 获取“分享到聊天”按钮点击状态及自定义分享内容接口
        wx.onMenuShareAppMessage({
            title: data.desc, // 分享标题
            link: data.bdUrl, // 分享链接
            imgUrl: data.bdPic, // 分享图标
            desc: '已经有' + randomNum + '个小伙伴分享了这张搞笑GIF哦！', // 分享描述
            type: 'link', // 分享类型,music、video或link，不填默认为link
            dataUrl: '' // 如果type是music或video，则要提供数据链接，默认为空
        });
        // 添加验证通过后的回调
        wx.ready(function(){
            // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
            // 获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
            setShareInfo();
        });
    };