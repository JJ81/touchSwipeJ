/*
option 
  css transition으로 구현이 가능한 경우 사용할 것.
  mousemove vs. touchmove 구분
  eventListener vs. attachEvent
  slideshow 기능
  pinch 기능
  애니메이션 가속도 구현
  elastic animation 구현
  plugin으로 변경
  use this "'use strict';" in function
  변수명 수정.Axis, module, delta...
*/

// var browser = {
//   addEventListener: !!window.addEventListener,
//   touch: ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch,
//   transitions: (function(temp) {
//     var props = ['transitionProperty', 'WebkitTransition', 'MozTransition', 'OTransition', 'msTransition'];
//     for ( var i in props ) {
//       if (temp.style[ props[i] ] !== undefined) return true;
//       return false;
//     }
//   })(document.createElement('swipe'))
// };


var 
doc  = document,
navHandler = doc.getElementById("navWrp"), // target
startX, startY ,distX, distY, // position & distance
swiping = false, // check user swipe action
handlerX = 0, // handler X-postion
isScrolling, // check scrolling or not
isTouchSupported = 'ontouchstart' in window,
startEvent = isTouchSupported ? 'touchstart' : 'mousedown',
moveEvent = isTouchSupported ? 'touchmove' : 'mousemove',
endEvent = isTouchSupported ? 'touchend' : 'mouseup';

// 각 메소드에서 해당 객체를 가리키기 위한 this를 설정하려면?
var events = {
  start : function (event) {
    
    if(isTouchSupported){ // if mobile
      var touchObj = event.changedTouches[0];
      startX = parseInt(touchObj.pageX);
      startY = parseInt(touchObj.pageY);
    }else{ // if pc
      startX = event.pageX;
      startY = event.pageY;
      //console.log(startX + "/" + startY);
    }

    swiping = true;
    isScrolling = undefined;
    
    events.setEventListener(moveEvent, events.move, false);
    events.setEventListener(endEvent, events.end, false);
    
  },
  move : function (event) {
    if(isTouchSupported){ // if mobile
      var touchObj = event.changedTouches[0];
      distX = parseInt(touchObj.pageX) - startX;
      distY = parseInt(touchObj.pageY) - startY;
    }else{
      
      distX = event.pageX - startX;
      distY = event.pageY - startY;
      console.log(distX + "/" + distY);
      
    }
      
    if (typeof isScrolling == 'undefined') {
      isScrolling = !!( isScrolling || Math.abs(distX) < Math.abs(distY) );
    }
    
   console.log(isScrolling + "/" + swiping);
    
    if(!isScrolling){
      if(swiping){
        
        this.style.left = parseInt(distX+handlerX) + "px";
        console.log("move / " + distX);
        
        // if mouseleave or mouseout, kill event
        events.setEventListener("mouseleave", events.end, false);
      } 
      // prevent native scrolling
      event.preventDefault();
    }
  },
  end : function (event) {
    handlerX = parseInt(this.style.left);
    swiping = false;
    startX = startY = distX = distY = 0;
    
    events.removeEventListener(moveEvent, events.move, false);
    events.removeEventListener(endEvent, events.end, false);
    events.removeEventListener("mouseleave", events.end, false);
    
  },
  
  
  setEventListener : function(action, func, bool){
    if (window.addEventListener) {
      navHandler.addEventListener(action, func, bool);
    }else{
      navHandler.attachEvent(action, func, bool);
    }  
  },
  removeEventListener : function(action, func, bool){
    if (window.addEventListener) {
      navHandler.removeEventListener(action, func, bool);
    }else{
      navHandler.removeEvent(action, func, bool);
    }  
  }
};

events.setEventListener(startEvent, events.start, false);

