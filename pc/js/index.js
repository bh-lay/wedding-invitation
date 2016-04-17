(function(){
	var countDownDays = Math.ceil( ( new Date(2016,9-1,28) - new Date() )/1000/60/60/24 ),
		MANY_ZEROS = "000000000000000000";

	function leftZeroPad(val, minLength) {
		if (typeof(val) != "string")
			val = String(val);
		return (MANY_ZEROS.substring(0, minLength - val.length)) + val;
	}
	console.log(leftZeroPad(countDownDays,3))
})();