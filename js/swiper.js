(function( global,factory ){
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    global.Swiper = factory();
  }
})(this,function(){
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
  function setCSS(dom,cssObj ){
    if( !dom || typeof(cssObj) !== 'object' ){
      return;
    }
    // 若参数dom为数组，则递归设置
    if( isNum(dom.length) ){
      each(dom,function(i,node){
        setCSS(node,cssObj);
      });
      return;
    }

    each(cssObj,function(key,value){
      setStyle(dom,key,value);
    });
  }
  function isWeiXin(){
    var ua = window.navigator.userAgent.toLowerCase();
    return !!ua.match(/microMessenger/i);
  }
  // 微信下不使用transform
  var privateUseTransform = true;//!isWeiXin();
  
  //处理自定义事件
  function ON(eventName,callback){
    this._events = this._events || {};
    //事件堆无该事件，创建一个事件堆
    if(!this._events[eventName]){
      this._events[eventName] = [];
    }
    this._events[eventName].push(callback);
    //提供链式调用的支持
    return this;
  }
  function EMIT(eventName,args){
    this._events = this._events || {};
    //事件堆无该事件，结束运行
    if(!this._events[eventName]){
      return
    }
    for(var i=0,total=this._events[eventName].length;i<total;i++){
      this._events[eventName][i].apply(this.event_global || this,args);
    }
  }

  // 设置top
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
  // 设置 slide 的 class
  function setActiveClass(nodes,index){
    each(nodes,function(i,node){
      var isCurrentIndex = index == i;

      node && node.classList[(isCurrentIndex ? 'add' : 'remove')]('slideActive');
      node && node.classList[(isCurrentIndex ? 'remove' : 'add')]('slideHidden');
    });
  }
  function Swiper(node,param){
        param = param || {};
    var me = this,
        // 窗口高度
        winHeight,

        // 默认显示
        defaultSlideIndex = parseInt(param.defaultSlideIndex) || 0,
        // 当前使用中的 slide [prev,current,next]
        activeSlide = [],
        activeSlideIndex = defaultSlideIndex,
        touch_start_time = 0,
        // 翻页动画时间
        slideAdjustTime = 400,
        // 动画时长
        animationDuration;

    this.node = node;
    this.slideClass = param.slideClass || 'page';
    this.slideList = this.node.getElementsByClassName(this.slideClass);

    this.init( defaultSlideIndex );

    new util.toucher(this.node).on('swipeStart',function(){
      winHeight = window.innerHeight;
      // alert(winHeight);
      activeSlide = [me.slideList[activeSlideIndex-1] || me.slideList[me.slideList.length-1],me.slideList[activeSlideIndex],me.slideList[activeSlideIndex+1] || me.slideList[0]];
      setCSS(activeSlide,{
        transition: '0s'
      });
      touch_start_time = new Date();
      // return false;
    }).on('swipe',function(e){
      // 上下偏移量
      var deviation = e.moveY;
      if( ( activeSlideIndex == 0 && deviation>0 ) || ( activeSlideIndex == me.slideList.length - 1 && deviation<0 ) ){
        deviation = deviation / 4;
      }
      setTop(activeSlide[0],deviation - winHeight);
      setTop(activeSlide[1],deviation);
      setTop(activeSlide[2],deviation + winHeight);
      return false;
    }).on('swipeEnd',function(e){
          // 翻页耗费时长
      var touchDuration = new Date() - touch_start_time;

      // 设置动画时长
      animationDuration = Math.min(touchDuration * 1.8,slideAdjustTime);

      setCSS(activeSlide,{
        transition: animationDuration + 'ms ease-out'
      });
      // alert( e.moveY + '-' + touchDuration );
      if( touchDuration < 200 ){
        if( e.moveY < 0 ){
          me.nextSlide();
        }else if( e.moveY > 0 ){
          me.prevSlide();
        }
      }else{
        if( e.moveY < -240 ){
          me.nextSlide();
        }else if( e.moveY > 240 ){
          me.prevSlide();
        }else{
          me.currentSlide();
        }
      }
      return false;
    });
    function setSlideClass(nodes,index){
      setTimeout(function(){
        setActiveClass(nodes,index);
      },animationDuration);
    }
    // console.log(this.slideList);
    // 向上翻页
    this.prevSlide = function(){
      setTop(activeSlide[0], 0);
      setTop(activeSlide[1], '100%');
      setTop(activeSlide[2], '100%');
      setSlideClass(activeSlide,0);
      activeSlideIndex--;
      if( activeSlideIndex == -1 ){
        activeSlideIndex = me.slideList.length - 1;
      }
      EMIT.call(this,'slideChange',[activeSlideIndex]);
    };
    // 停留在当前页
    this.currentSlide = function(){
      setTop(activeSlide[0], '-100%');
      setTop(activeSlide[1], 0);
      setTop(activeSlide[2], '100%');
    };
    // 向下翻页
    this.nextSlide = function(){
      setTop(activeSlide[0], '-100%');
      setTop(activeSlide[1], '-100%');
      setTop(activeSlide[2], '0');
      setSlideClass(activeSlide,2);
      activeSlideIndex++;

      if( activeSlideIndex == me.slideList.length ){
        activeSlideIndex = 0;
      }
      EMIT.call(this,'slideChange',[activeSlideIndex]);
    };
  }
  Swiper.prototype = {
    init: function( index ){
      var me = this;
      // 初始化布局
      each(this.slideList,function(i,node){
        setCSS(node,{
          position: 'absolute',
          top: 0,
          left: 0
        });
        setTop(node, (i == index ) ? 0 : '100%');
      });
      // 所有slide都默认关闭
      each(me.slideList,function(i,node){
        node && node.classList.add('slideHidden');
      });
      // 设置默认slide为激活状态
      setTimeout(function(){
        setActiveClass( [me.slideList[ index ]], 0);
      }, 20);
    },
    on: ON
  };
  return Swiper;
});