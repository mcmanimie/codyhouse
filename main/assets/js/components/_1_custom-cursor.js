// File#: _1_custom-cursor
// Usage: codyhouse.co/license
(function() {
  var CustomCursor = function(element) {
    this.element = element;
    this.targets = document.querySelectorAll('[data-custom-cursor="'+this.element.getAttribute('id')+'"]');
    this.target = false;
    this.moving = false;

    // cursor classes
    this.inClass = 'c-cursor--in';
    this.outClass = 'c-cursor--out';
    this.positionClass = 'c-cursor--';

    initCustomCursor(this);
  };

  function initCustomCursor(obj) {
    if(obj.targets.length == 0) return;
    // init events
    for( var i = 0; i < obj.targets.length; i++) {
      (function(i){
        obj.targets[i].addEventListener('mouseenter', handleEvent.bind(obj));
      })(i);
    }
  };

  function handleEvent(event) {
    switch(event.type) {
      case 'mouseenter': {
        initMouseEnter(this, event);
        break;
      }
      case 'mouseleave': {
        initMouseLeave(this, event);
        break;
      }
      case 'mousemove': {
        initMouseMove(this, event);
        break;
      }
    }
  };

  function initMouseEnter(obj, event) {
    removeTargetEvents(obj);
    obj.target = event.currentTarget;
    // listen for move and leave events
    obj.target.addEventListener('mousemove', handleEvent.bind(obj));
    obj.target.addEventListener('mouseleave', handleEvent.bind(obj));
    // show custom cursor
    toggleCursor(obj, true);
    // place custom cursor
    moveCursor(obj, event);
  };

  function initMouseLeave(obj, event) {
    removeTargetEvents(obj);
    toggleCursor(obj, false);
    if(obj.moving) {
      window.cancelAnimationFrame(obj.moving);
      obj.moving = false;
    }
  };

  function removeTargetEvents(obj) {
    if(obj.target) {
      obj.target.removeEventListener('mousemove', handleEvent.bind(obj));
      obj.target.removeEventListener('mouseleave', handleEvent.bind(obj));
      obj.target = false;
    }
  };

  function initMouseMove(obj, event) {
    if(obj.moving) return;
    obj.moving = window.requestAnimationFrame(function(){
      moveCursor(obj, event);
    });
  };

  function moveCursor(obj, event) {
    obj.element.style.transform = 'translateX('+event.clientX+'px) translateY('+event.clientY+'px)';
    // set position classes
    updatePositionClasses(obj, event.clientX, event.clientY);
    obj.moving = false;
  };

  function updatePositionClasses(obj, xposition, yposition) {
    if(!obj.target) return;
    var targetBoundingRect = obj.target.getBoundingClientRect();
    var isLeft = xposition < (targetBoundingRect.left + targetBoundingRect.width/2),
      isTop = yposition < (targetBoundingRect.top + targetBoundingRect.height/2);

    // reset classes
    Util.toggleClass(obj.element, obj.positionClass+'left', isLeft);
    Util.toggleClass(obj.element, obj.positionClass+'right', !isLeft);
    Util.toggleClass(obj.element, obj.positionClass+'top', isTop);
    Util.toggleClass(obj.element, obj.positionClass+'bottom', !isTop);
  };

  function toggleCursor(obj, bool) {
    Util.toggleClass(obj.element, obj.outClass, !bool);
    Util.toggleClass(obj.element, obj.inClass, bool);
  };

  window.CustomCursor = CustomCursor;

  var cCursor = document.getElementsByClassName('js-c-cursor');
  if( cCursor.length > 0 && !Util.osHasReducedMotion()) {
    for( var i = 0; i < cCursor.length; i++) {
      (function(i){new CustomCursor(cCursor[i]);})(i);
    }
  }
}());
