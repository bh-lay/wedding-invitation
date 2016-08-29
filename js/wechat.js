
// 微信配置
(function(){

	function extend_data(to, from){
		to = to || {};
		//粗略拷贝
		for(var i in from){
			if(!to[i] && typeof(to[i]) !== 'number'){
				to[i] = from[i];
			}
		}
		return to;
	}
	function getConfig(callback){
		var script = document.createElement("script"),
			callbackName = 'getWechatJsapiSign',
			nodeHead = document.getElementsByTagName('head')[0];
		window[callbackName] = function( json ){
			json = json || {};
			if( json.code == 200 ){
				callback && callback( null, json.config );
			}else{
				callback && callback( json.msg || 'err' );
			}

			window[callbackName] = null;
			nodeHead.removeChild( script );
		};

		script.src = 'http://bh-lay.com/ajax/getWechatJsapiSign?url=' + location.href + '&callback=' + callbackName;
		nodeHead.appendChild(script);
	}
	function getWechatScript( callback ){
	    var script = document.createElement('script');
	    script.src = '//res.wx.qq.com/open/js/jweixin-1.0.0.js';
	    document.body.appendChild(script);

	    script.onload = callback;
	}
	// 微信下才工作
	if ( window.navigator.userAgent.indexOf('MicroMessenger') >= 0 ) {
		// 获取公众号配置
		getConfig(function( err, configFromServer ){
			// 加载微信jsSDK
			getWechatScript(function(){
				var config = extend_data({
					debug: false,
					jsApiList: [
						'onMenuShareTimeline',
						'onMenuShareAppMessage'
					]
				}, configFromServer);
				// 配置开始
				wx.config( config );
		        wx.ready(function(){
					wx.onMenuShareTimeline({
						title: '22陈仁磊-田晓杰【一生只有一次，幸福只有一回】',
						link: encodeURI( location.href ),
						imgUrl: 'http://wedding.bh-lay.com/images/14-1.jpg'
					});
					wx.onMenuShareAppMessage({
						title:'11陈仁磊-田晓杰【一生只有一次，幸福只有一回】',
						link: encodeURI( location.href ),
						imgUrl: 'http://wedding.bh-lay.com/images/14-1.jpg',
						desc: '已经有' + 12 + '个小伙伴分享了这张搞笑GIF哦！', // 分享描述
						type: 'link',
						dataUrl: ''
					});
				});
			});
		});
	}
})();