function backgroundMusic(){
	var music = new Audio(),
		music_btn = document.querySelector('.music');

	music.addEventListener('play',function(){
		music_btn.classList.add('play');
	});
	music.addEventListener('pause',function(){
		music_btn.classList.remove('play');
	});
	//设置音乐属性
	music.autoplay = 'autoplay="autoplay"';
	music.loopPlay = 'loop="loop"';
	music.src = '/mp3/LoveParadise_C48kbps.mp3';
	
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
