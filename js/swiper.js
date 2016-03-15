(function(){
  /**
   * 判断对象类型
   * string number array
   * object function
   * htmldocument
   * undefined null
  */
  function TypeOf(obj) {
    return Object.prototype.toString.call(obj).match(/\s(\w+)/)[1].toLowerCase();
  }

  /**
   * 检测是否为数字
   * 兼容字符类数字 '23'
   */
  function isNum(ipt){
    return (ipt !== '') && (ipt == +ipt) ? true : false;
  }

  /**
   * 遍历数组或对象
   *
   */
  function each(arr,fn){
    //检测输入的值
    if(typeof(arr) != 'object' || typeof(fn) != 'function'){
      return;
    }
    var Length = arr.length;
    if( isNum(Length) ){
      for(var i=0;i<Length;i++){
        if(fn.call(this,i,arr[i]) === false){
          break
        }
      }
    }else{
      for(var i in arr){
        if (!arr.hasOwnProperty(i)){
          continue;
        }
        if(fn.call(this,i,arr[i]) === false){
          break
        }
      }
    }
  }
  /**
   * dom设置样式
   */
  function setStyle(elem,prop,value){
    if( !elem || !prop ){
      return;
    }
    prop = prop.toString();

    if ( isNum(value) && !prop.match(/zIndex|transition/)){
      value = value + "px";
    }
    elem.style[prop] = value;
    /**
     * 为css3属性增加扩展
    **/
    if( prop.match(/^(transform|transition)$/) ){
      setStyle(elem,'-webkit-' + prop, value);
    }
  }
  //设置css
  function setCSS(doms,cssObj){
    if( !isNum(doms.length) ){
      doms = [doms]
    }

    each(doms,function(i,dom){
      each(cssObj,function(key,value){
        setStyle(dom,key,value);
      });
    });
  }
  function isWeiXin(){
    var ua = window.navigator.userAgent.toLowerCase();
    return !!ua.match(/microMessenger/i);
  }
  // 微信下不使用transform
  var privateUseTransform = !isWeiXin();
  function setTop(node,value){
    if( !node ){
      return
    }
    if( isNum(value) ){
      value = value + 'px';
    }
    if( privateUseTransform ){
      setStyle(node, 'transform', 'translateY(' + value + ')');
    }else{
      setStyle(node, 'top', value);
    }
  }
  function swiper(node,slideClass){
    var me = this,
        winHeight,
        // 当前使用中的 slide [prev,current,next]
        activeSlide = [],
        activeSlideIndex = 0,
        touch_start_time = 0,
        // 翻页动画时间
        slideAdjustTime = 300;

    this.node = node;
    this.slideClass = slideClass;
    this.slideList = this.node.getElementsByClassName(this.slideClass);

    // 初始化布局
    each(this.slideList,function(i,node){
      setTop(node, (i == 0) ? 0 : '100%');
    });

    new util.toucher(this.node).on('swipeStart',function(){
      winHeight = window.innerHeight;
      // alert(winHeight);
      activeSlide = [me.slideList[activeSlideIndex-1],me.slideList[activeSlideIndex],me.slideList[activeSlideIndex+1]];
      setCSS(activeSlide,{
        transition: '0s'
      });
      touch_start_time = new Date();
    }).on('swipe',function(e){
      // 上下偏移量
      var deviation = e.moveY;
      if( ( activeSlideIndex == 0 && deviation>0 ) || ( activeSlideIndex == me.slideList.length - 1 && deviation<0 ) ){
        deviation = deviation / 3;
      }
      setTop(activeSlide[0],deviation - winHeight);
      setTop(activeSlide[1],deviation);
      setTop(activeSlide[2],deviation + winHeight);
      return false;
    }).on('swipeEnd',function(e){
          // 翻页耗费时长
      var touchDuration = new Date() - touch_start_time,
          // 设置动画时常
          animationDuration = Math.min(touchDuration,slideAdjustTime);

      setCSS(activeSlide,{
        transition: animationDuration + 'ms ease-out'
      });
      if( e.moveY < -100 ){
        me.nextSlide();
      }else if( e.moveY > 100 ){
        me.prevSlide();
      }else{
        me.currentSlide();
      }
      return false;
    });
    // console.log(this.slideList);
    // 向上翻页
    this.prevSlide = function(){
      if( activeSlideIndex == 0 ){
        this.currentSlide();
        return;
      }
      setTop(activeSlide[0], 0);
      setTop(activeSlide[1], '100%');
      setTop(activeSlide[2], '100%');
      activeSlideIndex--;
    };
    // 停留在当前页
    this.currentSlide = function(){
      setTop(activeSlide[0], '-100%');
      setTop(activeSlide[1], 0);
      setTop(activeSlide[2], '100%');
    };
    // 向下翻页
    this.nextSlide = function(){
      if( activeSlideIndex == this.slideList.length - 1 ){
        this.currentSlide();
        return;
      }
      setTop(activeSlide[0], '-100%');
      setTop(activeSlide[1], '-100%');
      setTop(activeSlide[2], '0');
      activeSlideIndex++;
    };
  }
  swiper.prototype = {

  };
  window.swiper = swiper;
})();
// alert(navigator.userAgent)
