(function(){
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
		return html + '<strong>天</strong>';
	}
	if( countDownDays < 0 ){
		utils.query('.countdown').style.display = 'none';
		return
	}
	var str_day = leftZeroPad(countDownDays,3),
		html = countDownDays == 0 ? '<span>婚</span><span>礼</span><span>中</span>' : createCountDownHtml( str_day );
	
	utils.query('.countdown-body').innerHTML = html;

})();