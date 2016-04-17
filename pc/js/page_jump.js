(function(){
	//平台、设备和操作系统 
	var isMobile = !!navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
	
	/**
	 * 判断是否支持css属性
	 * 兼容css3
	**/
	var supports = (function() {
		var styles = document.createElement('div').style,
			vendors = 'Webkit Khtml Ms O Moz'.split(/\s/);
		return function(prop) {
			if ( prop in styles ){
				return prop;
			}else{
				prop = prop.replace(/^[a-z]/, function(val) {
					return val.toUpperCase();
				});
				for(var i=0,total=vendors.length;i<total;i++){
					if ( vendors[i] + prop in styles ) {
						return ('-' + vendors[i] + '-' + prop).toLowerCase();
					}
				}
			}
		};
	})();
	/**
	 * 是否支持 canvas
	**/
	function supports_canvas() {
		return !!document.createElement('canvas').getContext;
	}

	/**
	 * 检测是否为高级浏览器
	**/
	var isAdvancedBrowser = supports('transition') && supports('transform') && supports_canvas();
	
	//手机访问跳转至手机页面
	if ( isMobile ) { 
		location.href = "/";
	}else if( !isAdvancedBrowser ){
		// 非高级浏览器跳转至基础页面
		location.href = "/pc/simple.html";
	}
})();