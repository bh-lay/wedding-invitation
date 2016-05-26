function backgroundMusic(){
	var music = document.querySelector('audio'),
		music_btn = document.querySelector('.music');

	music.addEventListener('play',function(){
		music_btn.classList.add('play');
	});
	music.addEventListener('pause',function(){
		music_btn.classList.remove('play');
	});
	music.addEventListener('oncanplay',function(){
		music.play();
	});
	music.addEventListener('onended',function(){
		music.play();
	});

	//设置音乐属性
	
	music.play();

	function mustPlayFirst(){
		music.play();
		document.removeEventListener('touchstart',mustPlayFirst , false);
	}
	document.addEventListener('touchstart', mustPlayFirst, false);
	music_btn.addEventListener('click',function(){
		if (music.paused) {
			music.play();
		} else {
			music.pause();
		}
	});
}
