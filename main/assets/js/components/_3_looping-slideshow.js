// File#: _3_looping-slideshow
// Usage: codyhouse.co/license
(function() {
  var LoopSlideshow = function(element) {
    this.element = element;
    this.slideshowObj = false;
    this.navItems = this.element.getElementsByClassName('js-slideshow__nav-item');
    this.autoplayInterval = 5000;
    this.autoplayPaused = false;
    this.fillingCSS = '--loop-slideshow-filling';
    this.pauseBtnClass = 'js-loop-slideshow__pause-btn';
    this.pauseBtn = this.element.getElementsByClassName(this.pauseBtnClass);
    this.animating = false;
    this.currentTime = false;

    initLoopSlideshow(this);
    initEvents(this);
  };

  function initLoopSlideshow(obj) {
    var autoplay = true,
      autoplayInterval = (obj.element.getAttribute('data-autoplay-interval')) ? obj.element.getAttribute('data-autoplay-interval') : obj.autoplayInterval,
      swipe = (obj.element.getAttribute('data-swipe') && obj.element.getAttribute('data-swipe') == 'on') ? true : false;
    obj.slideshowObj = new Slideshow({element: obj.element, navigation: true, autoplay : autoplay, autoplayInterval : autoplayInterval, swipe : swipe, navigationClass: 'loop-slideshow__navigation', navigationItemClass: 'loop-slideshow__nav-item', autoplayOnHover: true, autoplayOnFocus: true});
    // update autoplay interval
    obj.autoplayInterval = autoplayInterval;
    // filling effect for first item
    initFilling(obj, obj.slideshowObj.selectedSlide);
  };

  function initEvents(obj) {
    obj.element.addEventListener('newItemSelected', function(event){
      // new slide has been selected
      initFilling(obj, event.detail);
      toggleAutoplay(obj, false);
    });

    // custom click on image -> animate slideshow
    obj.element.addEventListener('click', function(event){
      if(event.target.closest('.js-loop-slideshow__pause-btn')) {
        toggleAutoplay(obj, !obj.autoplayPaused); // pause/play autoplay
      } else if(event.target.closest('.js-slideshow__item')) {
        showNewSlide(obj, event);
      }
    });
  };

  function initFilling(obj, index) {
    cancelFilling(obj);

    for(var i = 0; i < obj.navItems.length; i++) {
      setFilling(obj.navItems[i], obj.fillingCSS, 0);
    }
    // trigger animation
    obj.currentTime = false;
    animateFilling(obj, index);
  };

  function cancelFilling(obj) {
    if(obj.animating) { // clear previous animation
      window.cancelAnimationFrame(obj.animating);
      obj.animating = false;
    }
  };

  function animateFilling(obj, index) {
    obj.animating = window.requestAnimationFrame(function(timestamp){
      if(!obj.currentTime) obj.currentTime = timestamp;
      var progress = timestamp - obj.currentTime;
      if(progress > obj.autoplayInterval) progress = obj.autoplayInterval;
      setFilling(obj.navItems[index], obj.fillingCSS, (progress/obj.autoplayInterval).toFixed(3));

      if(progress < obj.autoplayInterval) {
        animateFilling(obj, index);
      } else {
        // animation is over
        obj.animating = false;
        obj.currentTime = false;
      }
    });
  };

  function setFilling(element, property, value) {
    element.style.setProperty(property, value);
  };

  function showNewSlide(obj, event) {
    // check if we should go next or prev
    var boundingRect = obj.element.getBoundingClientRect(),
      isNext = event.clientX > boundingRect.left + boundingRect.width/2;

    isNext ? obj.slideshowObj.showNext() : obj.slideshowObj.showPrev();
  };

  function toggleAutoplay(obj, bool) {
    obj.autoplayPaused = bool;
    if(obj.autoplayPaused) {
      cancelFilling(obj);
      obj.slideshowObj.pauseAutoplay();
    } else {
      obj.slideshowObj.startAutoplay();
      initFilling(obj, obj.slideshowObj.selectedSlide);
    }
    if(obj.pauseBtn.length > 0) {
      // update btn appearance
      Util.toggleClass(obj.pauseBtn[0], 'btn-states--state-b', obj.autoplayPaused);
      // update pressed status
      obj.autoplayPaused ? obj.pauseBtn[0].setAttribute('aria-pressed', 'true'): obj.pauseBtn[0].setAttribute('aria-pressed', 'false');
    }
  };

  //initialize the ThumbSlideshow objects
  var slideshow = document.getElementsByClassName('js-loop-slideshow');
  if( slideshow.length > 0 ) {
    for( var i = 0; i < slideshow.length; i++) {
      (function(i){
        new LoopSlideshow(slideshow[i]);
      })(i);
    }
  }
}());
