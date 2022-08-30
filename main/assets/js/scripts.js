// Utility function
function Util () {};

/*
	class manipulation functions
*/
Util.hasClass = function(el, className) {
	return el.classList.contains(className);
};

Util.addClass = function(el, className) {
	var classList = className.split(' ');
 	el.classList.add(classList[0]);
 	if (classList.length > 1) Util.addClass(el, classList.slice(1).join(' '));
};

Util.removeClass = function(el, className) {
	var classList = className.split(' ');
	el.classList.remove(classList[0]);
	if (classList.length > 1) Util.removeClass(el, classList.slice(1).join(' '));
};

Util.toggleClass = function(el, className, bool) {
	if(bool) Util.addClass(el, className);
	else Util.removeClass(el, className);
};

Util.setAttributes = function(el, attrs) {
  for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
};

/*
  DOM manipulation
*/
Util.getChildrenByClassName = function(el, className) {
  var children = el.children,
    childrenByClass = [];
  for (var i = 0; i < children.length; i++) {
    if (Util.hasClass(children[i], className)) childrenByClass.push(children[i]);
  }
  return childrenByClass;
};

Util.is = function(elem, selector) {
  if(selector.nodeType){
    return elem === selector;
  }

  var qa = (typeof(selector) === 'string' ? document.querySelectorAll(selector) : selector),
    length = qa.length,
    returnArr = [];

  while(length--){
    if(qa[length] === elem){
      return true;
    }
  }

  return false;
};

/*
	Animate height of an element
*/
Util.setHeight = function(start, to, element, duration, cb, timeFunction) {
	var change = to - start,
	    currentTime = null;

  var animateHeight = function(timestamp){
    if (!currentTime) currentTime = timestamp;
    var progress = timestamp - currentTime;
    if(progress > duration) progress = duration;
    var val = parseInt((progress/duration)*change + start);
    if(timeFunction) {
      val = Math[timeFunction](progress, start, to - start, duration);
    }
    element.style.height = val+"px";
    if(progress < duration) {
        window.requestAnimationFrame(animateHeight);
    } else {
    	if(cb) cb();
    }
  };

  //set the height of the element before starting animation -> fix bug on Safari
  element.style.height = start+"px";
  window.requestAnimationFrame(animateHeight);
};

/*
	Smooth Scroll
*/

Util.scrollTo = function(final, duration, cb, scrollEl) {
  var element = scrollEl || window;
  var start = element.scrollTop || document.documentElement.scrollTop,
    currentTime = null;

  if(!scrollEl) start = window.scrollY || document.documentElement.scrollTop;

  var animateScroll = function(timestamp){
  	if (!currentTime) currentTime = timestamp;
    var progress = timestamp - currentTime;
    if(progress > duration) progress = duration;
    var val = Math.easeInOutQuad(progress, start, final-start, duration);
    element.scrollTo(0, val);
    if(progress < duration) {
      window.requestAnimationFrame(animateScroll);
    } else {
      cb && cb();
    }
  };

  window.requestAnimationFrame(animateScroll);
};

/*
  Focus utility classes
*/

//Move focus to an element
Util.moveFocus = function (element) {
  if( !element ) element = document.getElementsByTagName("body")[0];
  element.focus();
  if (document.activeElement !== element) {
    element.setAttribute('tabindex','-1');
    element.focus();
  }
};

/*
  Misc
*/

Util.getIndexInArray = function(array, el) {
  return Array.prototype.indexOf.call(array, el);
};

Util.cssSupports = function(property, value) {
  if('CSS' in window) {
    return CSS.supports(property, value);
  } else {
    var jsProperty = property.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase();});
    return jsProperty in document.body.style;
  }
};

// merge a set of user options into plugin defaults
// https://gomakethings.com/vanilla-javascript-version-of-jquery-extend/
Util.extend = function() {
  // Variables
  var extended = {};
  var deep = false;
  var i = 0;
  var length = arguments.length;

  // Check if a deep merge
  if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
    deep = arguments[0];
    i++;
  }

  // Merge the object into the extended object
  var merge = function (obj) {
    for ( var prop in obj ) {
      if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
        // If deep merge and property is an object, merge properties
        if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
          extended[prop] = extend( true, extended[prop], obj[prop] );
        } else {
          extended[prop] = obj[prop];
        }
      }
    }
  };

  // Loop through each object and conduct a merge
  for ( ; i < length; i++ ) {
    var obj = arguments[i];
    merge(obj);
  }

  return extended;
};

// Check if Reduced Motion is enabled
Util.osHasReducedMotion = function() {
  if(!window.matchMedia) return false;
  var matchMediaObj = window.matchMedia('(prefers-reduced-motion: reduce)');
  if(matchMediaObj) return matchMediaObj.matches;
  return false; // return false if not supported
};

/*
	Polyfills
*/
//Closest() method
if (!Element.prototype.matches) {
	Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
	Element.prototype.closest = function(s) {
		var el = this;
		if (!document.documentElement.contains(el)) return null;
		do {
			if (el.matches(s)) return el;
			el = el.parentElement || el.parentNode;
		} while (el !== null && el.nodeType === 1);
		return null;
	};
}

//Custom Event() constructor
if ( typeof window.CustomEvent !== "function" ) {

  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
   }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
}

/*
	Animation curves
*/
Math.easeInOutQuad = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t + b;
	t--;
	return -c/2 * (t*(t-2) - 1) + b;
};

Math.easeInQuart = function (t, b, c, d) {
	t /= d;
	return c*t*t*t*t + b;
};

Math.easeOutQuart = function (t, b, c, d) {
  t /= d;
	t--;
	return -c * (t*t*t*t - 1) + b;
};

Math.easeInOutQuart = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t*t*t + b;
	t -= 2;
	return -c/2 * (t*t*t*t - 2) + b;
};

Math.easeOutElastic = function (t, b, c, d) {
  var s=1.70158;var p=d*0.7;var a=c;
  if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
  if (a < Math.abs(c)) { a=c; var s=p/4; }
  else var s = p/(2*Math.PI) * Math.asin (c/a);
  return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
};


/* JS Utility Classes */

// make focus ring visible only for keyboard navigation (i.e., tab key)
(function() {
  var focusTab = document.getElementsByClassName('js-tab-focus'),
    shouldInit = false,
    outlineStyle = false,
    eventDetected = false;

  function detectClick() {
    if(focusTab.length > 0) {
      resetFocusStyle(false);
      window.addEventListener('keydown', detectTab);
    }
    window.removeEventListener('mousedown', detectClick);
    outlineStyle = false;
    eventDetected = true;
  };

  function detectTab(event) {
    if(event.keyCode !== 9) return;
    resetFocusStyle(true);
    window.removeEventListener('keydown', detectTab);
    window.addEventListener('mousedown', detectClick);
    outlineStyle = true;
  };

  function resetFocusStyle(bool) {
    var outlineStyle = bool ? '' : 'none';
    for(var i = 0; i < focusTab.length; i++) {
      focusTab[i].style.setProperty('outline', outlineStyle);
    }
  };

  function initFocusTabs() {
    if(shouldInit) {
      if(eventDetected) resetFocusStyle(outlineStyle);
      return;
    }
    shouldInit = focusTab.length > 0;
    window.addEventListener('mousedown', detectClick);
  };

  initFocusTabs();
  window.addEventListener('initFocusTabs', initFocusTabs);
}());

function resetFocusTabsStyle() {
  window.dispatchEvent(new CustomEvent('initFocusTabs'));
};

// File#: _1_3d-card
// Usage: codyhouse.co/license
(function() {
  var TdCard = function(element) {
    this.element = element;
    this.maxRotation = parseInt(this.element.getAttribute('data-rotation')) || 2; // rotation max value
    this.perspective = this.element.getAttribute('data-perspective') || '300px'; // perspective value
    this.rotateX = 0;
    this.rotateY = 0;
    this.partRotateX = 0;
    this.partRotateY = 0;
    this.deltaRotation = 0.3;
    this.animating = false;
    initTdEvents(this);
  };

  function initTdEvents(tdCard) {
    // detect mouse hovering over the card
    tdCard.element.addEventListener('mousemove', function(event){
      if(tdCard.animating) return;
      tdCard.animating = window.requestAnimationFrame(moveCard.bind(tdCard, event, false));
    });

    // detect mouse leaving the card
    tdCard.element.addEventListener('mouseleave', function(event){
      if(tdCard.animating) window.cancelAnimationFrame(tdCard.animating);
      tdCard.animating = window.requestAnimationFrame(moveCard.bind(tdCard, event, true));
    });
  };

  function moveCard(event, leaving) {
    // get final rotation values
    setRotationLevel(this, event, leaving);

    // update rotation values
    updateRotationLevel(this);
  };

  function setRotationLevel(tdCard, event, leaving) {
    if(leaving) {
      tdCard.rotateX = 0;
      tdCard.rotateY = 0;
      return;
    }

    var wrapperPosition = tdCard.element.getBoundingClientRect();
    var rotateY = 2*(tdCard.maxRotation/wrapperPosition.width)*(event.clientX - wrapperPosition.left - wrapperPosition.width/2);
    var rotateX = 2*(tdCard.maxRotation/wrapperPosition.height)*(wrapperPosition.top - event.clientY + wrapperPosition.height/2);

    if(rotateY > tdCard.maxRotation) rotateY = tdCard.maxRotation;
    if(rotateY < -1*tdCard.maxRotation) rotateY = -tdCard.maxRotation;
    if(rotateX > tdCard.maxRotation) rotateX = tdCard.maxRotation;
    if(rotateX < -1*tdCard.maxRotation) rotateX = -tdCard.maxRotation;

    tdCard.rotateX = rotateX;
    tdCard.rotateY = rotateY;
  };

  function updateRotationLevel(tdCard) {
    if( (tdCard.partRotateX == tdCard.rotateX) && (tdCard.partRotateY == tdCard.rotateY)) {
      tdCard.animating = false;
      return;
    }

    tdCard.partRotateX = getPartRotation(tdCard.partRotateX, tdCard.rotateX, tdCard.deltaRotation);
    tdCard.partRotateY = getPartRotation(tdCard.partRotateY, tdCard.rotateY, tdCard.deltaRotation);
    // set partial rotation
    rotateCard(tdCard);
    // keep rotating the card
    tdCard.animating = window.requestAnimationFrame(function(){
      updateRotationLevel(tdCard);
    });
  };

  function getPartRotation(start, end, delta) {
    if(start == end) return end;
    var newVal = start;
    if(start < end) {
      newVal = start + delta;
      if(newVal > end) newVal = end;
    } else if(start > end) {
      newVal = start - delta;
      if(newVal < end) newVal = end;
    }
    return newVal;
  }

  function rotateCard(tdCard) {
    tdCard.element.style.transform = 'perspective('+tdCard.perspective+') rotateX('+tdCard.partRotateX+'deg) rotateY('+tdCard.partRotateY+'deg)';
  };

  window.TdCard = TdCard;

  //initialize the TdCard objects
  var tdCards = document.getElementsByClassName('js-td-card');
  if( tdCards.length > 0 && Util.cssSupports('transform', 'translateZ(0px)')) {
    for( var i = 0; i < tdCards.length; i++) {
      (function(i){
        new TdCard(tdCards[i]);
      })(i);
    }
  };
}());

// File#: _1_accordion
// Usage: codyhouse.co/license
(function() {
  var Accordion = function(element) {
    this.element = element;
    this.items = Util.getChildrenByClassName(this.element, 'js-accordion__item');
    this.version = this.element.getAttribute('data-version') ? '-'+this.element.getAttribute('data-version') : '';
    this.showClass = 'accordion'+this.version+'__item--is-open';
    this.animateHeight = (this.element.getAttribute('data-animation') == 'on');
    this.multiItems = !(this.element.getAttribute('data-multi-items') == 'off');
    // deep linking options
    this.deepLinkOn = this.element.getAttribute('data-deep-link') == 'on';
    // init accordion
    this.initAccordion();
  };

  Accordion.prototype.initAccordion = function() {
    //set initial aria attributes
    for( var i = 0; i < this.items.length; i++) {
      var button = this.items[i].getElementsByTagName('button')[0],
        content = this.items[i].getElementsByClassName('js-accordion__panel')[0],
        isOpen = Util.hasClass(this.items[i], this.showClass) ? 'true' : 'false';
      Util.setAttributes(button, {'aria-expanded': isOpen, 'aria-controls': 'accordion-content-'+i, 'id': 'accordion-header-'+i});
      Util.addClass(button, 'js-accordion__trigger');
      Util.setAttributes(content, {'aria-labelledby': 'accordion-header-'+i, 'id': 'accordion-content-'+i});
    }

    //listen for Accordion events
    this.initAccordionEvents();

    // check deep linking option
    this.initDeepLink();
  };

  Accordion.prototype.initAccordionEvents = function() {
    var self = this;

    this.element.addEventListener('click', function(event) {
      var trigger = event.target.closest('.js-accordion__trigger');
      //check index to make sure the click didn't happen inside a children accordion
      if( trigger && Util.getIndexInArray(self.items, trigger.parentElement) >= 0) self.triggerAccordion(trigger);
    });
  };

  Accordion.prototype.triggerAccordion = function(trigger) {
    var bool = (trigger.getAttribute('aria-expanded') === 'true');

    this.animateAccordion(trigger, bool, false);

    if(!bool && this.deepLinkOn) {
      history.replaceState(null, '', '#'+trigger.getAttribute('aria-controls'));
    }
  };

  Accordion.prototype.animateAccordion = function(trigger, bool, deepLink) {
    var self = this;
    var item = trigger.closest('.js-accordion__item'),
      content = item.getElementsByClassName('js-accordion__panel')[0],
      ariaValue = bool ? 'false' : 'true';

    if(!bool) Util.addClass(item, this.showClass);
    trigger.setAttribute('aria-expanded', ariaValue);
    self.resetContentVisibility(item, content, bool);

    if( !this.multiItems && !bool || deepLink) this.closeSiblings(item);
  };

  Accordion.prototype.resetContentVisibility = function(item, content, bool) {
    Util.toggleClass(item, this.showClass, !bool);
    content.removeAttribute("style");
    if(bool && !this.multiItems) { // accordion item has been closed -> check if there's one open to move inside viewport
      this.moveContent();
    }
  };

  Accordion.prototype.closeSiblings = function(item) {
    //if only one accordion can be open -> search if there's another one open
    var index = Util.getIndexInArray(this.items, item);
    for( var i = 0; i < this.items.length; i++) {
      if(Util.hasClass(this.items[i], this.showClass) && i != index) {
        this.animateAccordion(this.items[i].getElementsByClassName('js-accordion__trigger')[0], true, false);
        return false;
      }
    }
  };

  Accordion.prototype.moveContent = function() { // make sure title of the accordion just opened is inside the viewport
    var openAccordion = this.element.getElementsByClassName(this.showClass);
    if(openAccordion.length == 0) return;
    var boundingRect = openAccordion[0].getBoundingClientRect();
    if(boundingRect.top < 0 || boundingRect.top > window.innerHeight) {
      var windowScrollTop = window.scrollY || document.documentElement.scrollTop;
      window.scrollTo(0, boundingRect.top + windowScrollTop);
    }
  };

  Accordion.prototype.initDeepLink = function() {
    if(!this.deepLinkOn) return;
    var hash = window.location.hash.substr(1);
    if(!hash || hash == '') return;
    var trigger = this.element.querySelector('.js-accordion__trigger[aria-controls="'+hash+'"]');
    if(trigger && trigger.getAttribute('aria-expanded') !== 'true') {
      this.animateAccordion(trigger, false, true);
      setTimeout(function(){trigger.scrollIntoView(true);});
    }
  };

  window.Accordion = Accordion;

  //initialize the Accordion objects
  var accordions = document.getElementsByClassName('js-accordion');
  if( accordions.length > 0 ) {
    for( var i = 0; i < accordions.length; i++) {
      (function(i){new Accordion(accordions[i]);})(i);
    }
  }
}());

// File#: _1_anim-menu-btn
// Usage: codyhouse.co/license
(function() {
  var menuBtns = document.getElementsByClassName('js-anim-menu-btn');
  if( menuBtns.length > 0 ) {
    for(var i = 0; i < menuBtns.length; i++) {(function(i){
      initMenuBtn(menuBtns[i]);
    })(i);}

    function initMenuBtn(btn) {
      btn.addEventListener('click', function(event){
        event.preventDefault();
        var status = !Util.hasClass(btn, 'anim-menu-btn--state-b');
        Util.toggleClass(btn, 'anim-menu-btn--state-b', status);
        // emit custom event
        var event = new CustomEvent('anim-menu-btn-clicked', {detail: status});
        btn.dispatchEvent(event);
      });
    };
  }
}());

// File#: _1_chameleonic-header
// Usage: codyhouse.co/license
(function() {
  var ChaHeader = function(element) {
    this.element = element;
    this.sections = document.getElementsByClassName('js-cha-section');
    this.header = this.element.getElementsByClassName('js-cha-header')[0];
    // handle mobile behaviour
    this.headerTrigger = this.element.getElementsByClassName('js-cha-header__trigger');
    this.modal = document.getElementsByClassName('js-cha-modal');
    this.focusMenu = false;
    this.firstFocusable = null;
    this.lastFocusable = null;
    initChaHeader(this);
  };

  function initChaHeader(element) {
    // set initial status
    for(var j = 0; j < element.sections.length; j++) {
      initSection(element, j);
    }

    // handle mobile behaviour
    if(element.headerTrigger.length > 0) {
      initMobileVersion(element);
    }

    // make sure header element is visible when in focus
    element.header.addEventListener('focusin', function(event){
      checkHeaderVisible(element);
    });
  };

  function initSection(element, index) {
    // clone header element inside each section
    var cloneItem = (index == 0) ? element.element : element.element.cloneNode(true);
    Util.removeClass(cloneItem, 'js-cha-header-clip');
    var customClasses = element.sections[index].getAttribute('data-header-class');
    // hide clones to SR
    cloneItem.setAttribute('aria-hidden', 'true');
    if( customClasses ) Util.addClass(cloneItem.getElementsByClassName('js-cha-header')[0], customClasses);
    // keyborad users - make sure cloned items are not tabbable
    if(index != 0) {
      // reset tab index
      resetTabIndex(cloneItem);
      element.sections[index].insertBefore(cloneItem, element.sections[index].firstChild);
    }
  }

  function resetTabIndex(clone) {
    var focusable = clone.querySelectorAll('[href], button, input');
    for(var i = 0; i < focusable.length; i++) {
      focusable[i].setAttribute('tabindex', '-1');
    }
  };

  function initMobileVersion(element) {
    //detect click on nav trigger
    var triggers = document.getElementsByClassName('js-cha-header__trigger');
    for(var i = 0; i < triggers.length; i++) {
      triggers[i].addEventListener("click", function(event) {
        event.preventDefault();
        var ariaExpanded = !Util.hasClass(element.modal[0], 'is-visible');
        //show nav and update button aria value
        Util.toggleClass(element.modal[0], 'is-visible', ariaExpanded);
        element.headerTrigger[0].setAttribute('aria-expanded', ariaExpanded);
        if(ariaExpanded) { //opening menu -> move focus to first element inside nav
          getFocusableElements(element);
          element.firstFocusable.focus();
        } else if(element.focusMenu) {
          if(window.scrollY < element.focusMenu.offsetTop) element.focusMenu.focus();
          element.focusMenu = false;
        }
      });
    }

    // close modal on click
    element.modal[0].addEventListener("click", function(event) {
      if(!event.target.closest('.js-cha-modal__close')) return;
      closeModal(element);
    });

    // listen for key events
    window.addEventListener('keydown', function(event){
      // listen for esc key
      if( (event.keyCode && event.keyCode == 27) || (event.key && event.key.toLowerCase() == 'escape' )) {
        // close navigation on mobile if open
        if(element.headerTrigger[0].getAttribute('aria-expanded') == 'true' && isVisible(element.headerTrigger[0])) {
          closeModal(element);
        }
      }
      // listen for tab key
      if( (event.keyCode && event.keyCode == 9) || (event.key && event.key.toLowerCase() == 'tab' )) {
        trapFocus(element, event);
      }
    });
  };

  function closeModal(element) {
    element.focusMenu = element.headerTrigger[0]; // move focus to menu trigger when menu is close
    element.headerTrigger[0].click();
  };

  function trapFocus(element, event) {
    if( element.firstFocusable == document.activeElement && event.shiftKey) {
      //on Shift+Tab -> focus last focusable element when focus moves out of modal
      event.preventDefault();
      element.lastFocusable.focus();
    }
    if( element.lastFocusable == document.activeElement && !event.shiftKey) {
      //on Tab -> focus first focusable element when focus moves out of modal
      event.preventDefault();
      element.firstFocusable.focus();
    }
  };

  function getFocusableElements(element) {
    //get all focusable elements inside the modal
    var allFocusable = element.modal[0].querySelectorAll('[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary');
    getFirstVisible(element, allFocusable);
    getLastVisible(element, allFocusable);
  };

  function getFirstVisible(element, elements) {
    //get first visible focusable element inside the modal
    for(var i = 0; i < elements.length; i++) {
      if( elements[i].offsetWidth || elements[i].offsetHeight || elements[i].getClientRects().length ) {
        element.firstFocusable = elements[i];
        return true;
      }
    }
  };

  function getLastVisible(element, elements) {
    //get last visible focusable element inside the modal
    for(var i = elements.length - 1; i >= 0; i--) {
      if( elements[i].offsetWidth || elements[i].offsetHeight || elements[i].getClientRects().length ) {
        element.lastFocusable = elements[i];
        return true;
      }
    }
  };

  function checkHeaderVisible(element) {
    if(window.scrollY > element.sections[0].offsetHeight - element.header.offsetHeight) window.scrollTo(0, 0);
  };

  function isVisible(element) {
    return (element.offsetWidth || element.offsetHeight || element.getClientRects().length);
  };

  // init the ChaHeader Object
  var chaHader = document.getElementsByClassName('js-cha-header-clip'),
    clipPathSupported = Util.cssSupports('clip-path', 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)') || Util.cssSupports('-webkit-clip-path', 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)');
  if(chaHader.length > 0 && clipPathSupported) {
    for(var i = 0; i < chaHader.length; i++) {
      new ChaHeader(chaHader[i]);
    }
  }
}());

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



//
// Hero text fade scroll
//
$(window).scroll(function(){
  $(".js-scoll-fade").css("opacity", 1 - $(window).scrollTop() / 100);
});


//
// initialize smooth scroll
//
scroll = new SmoothScroll('.js-scroll', {
  speed: 300,
  offset: 70
});


//
// initialize hash modal
//
$(document).ready(function(){
	if(window.location.hash) {
	    var hash = window.location.hash.substring(1); //Puts hash in variable, and removes the # character
			var modal = document.getElementsByClassName('js-modal');

			if (hash == "warranty") {
				openModal(modal[4]);
			}

	} else {

	}

	function openModal(element) {
	  var event = new CustomEvent('openModal');
	  element.dispatchEvent(event);
	};

});






//
// initialize scroll fun
//
$(document).ready(function(){

  var winHeight,
      winWidth            = parseInt($(window).innerWidth()),
      scrollPos = 0;

  var hand                = $('.hand'),
      draws               = $('.drawing');

  function drawing(scrollPos){

    var handPos     = parseInt(hand.offset().top),
        drawsHeight = parseInt(draws.innerHeight()),
        drawsTop = draws[0].offsetTop;
        handScrollL = hand.innerHeight() + handPos - drawsHeight + 50,
        handScroll  = scrollPos-handPos + 250;
        startScroll = hand.innerHeight();

    console.log('ScrollPos: ' + scrollPos + ' // handScroll: ' + handScroll + ' // CONDITIONS : ' + handScrollL + ' // START SCROLL : ' + startScroll);

    if (handScroll > 250) {
      if (scrollPos < handScrollL) {
        draws.css('top', handScroll);
      } else {
        //draws.css('top', handScrollL - handPos);
      }
    } else {
      draws.css('top', 275);
      console.log("TOP HIT");
    }

  }

  $(document).on('scroll', function(){
    // Variables
    scrollPos         = parseInt($(window).scrollTop());
    winHeight         = parseInt($(window).innerHeight());
    winWidth          = parseInt($(window).innerWidth());

    //Hand drawing function
    drawing(scrollPos);

  });

});

// File#: _1_looping_tabs
// Usage: codyhouse.co/license
(function() {

  var featureTop = document.getElementsByClassName('features-top')[0]

  var LoopTab = function(opts) {
    this.options = Util.extend(LoopTab.defaults , opts);
    this.element = this.options.element;
    this.tabList = this.element.getElementsByClassName('js-loop-tabs__controls')[0];
    this.listItems = this.tabList.getElementsByTagName('li');
    this.triggers = this.tabList.getElementsByTagName('a');
    this.panelsList = this.element.getElementsByClassName('js-loop-tabs__panels')[0];
    this.panels = Util.getChildrenByClassName(this.panelsList, 'js-loop-tabs__panel');
    this.assetsList = this.element.getElementsByClassName('js-loop-tabs__assets')[0];
    this.assets = this.assetsList.getElementsByTagName('li');
    this.videos = getVideoElements(this);
    this.panelShowClass = 'loop-tabs__panel--selected';
    this.assetShowClass = 'loop-tabs__asset--selected';
    this.assetExitClass = 'loop-tabs__asset--exit';
    this.controlActiveClass = 'loop-tabs__control--selected';

    // autoplay
    this.autoplayPaused = false;
    this.loopTabAutoId = false;
    this.loopFillAutoId = false;
    this.loopFill = 0;
    initLoopTab(this);
  };

  function getVideoElements(tab) {
    var videos = [];
    for(var i = 0; i < tab.assets.length; i++) {
      var video = tab.assets[i].getElementsByTagName('video');
      videos[i] = video.length > 0 ? video[0] : false;
    }
    return videos;
  };

  function initLoopTab(tab) {
    //set initial aria attributes
    tab.tabList.setAttribute('role', 'tablist');
    for( var i = 0; i < tab.triggers.length; i++) {
      var bool = Util.hasClass(tab.triggers[i], tab.controlActiveClass),
        panelId = tab.panels[i].getAttribute('id');
      tab.listItems[i].setAttribute('role', 'presentation');
      Util.setAttributes(tab.triggers[i], {'role': 'tab', 'aria-selected': bool, 'aria-controls': panelId, 'id': 'tab-'+panelId});
      Util.addClass(tab.triggers[i], 'js-loop-tabs__trigger');
      Util.setAttributes(tab.panels[i], {'role': 'tabpanel', 'aria-labelledby': 'tab-'+panelId});
      Util.toggleClass(tab.panels[i], tab.panelShowClass, bool);
      Util.toggleClass(tab.assets[i], tab.assetShowClass, bool);

      resetVideo(tab, i, bool); // play/pause video if available

      if(!bool) tab.triggers[i].setAttribute('tabindex', '-1');
    }
    // add autoplay-off class if needed
    !tab.options.autoplay && Util.addClass(tab.element, 'loop-tabs--autoplay-off');
    //listen for Tab events
    initLoopTabEvents(tab);
  };

  function initLoopTabEvents(tab) {
    if(tab.options.autoplay) {
      initLoopTabAutoplay(tab); // init autoplay
      // pause autoplay if user is interacting with the tabs
      tab.element.addEventListener('focusin', function(event){
        pauseLoopTabAutoplay(tab);
        tab.autoplayPaused = true;
      });
      tab.element.addEventListener('focusout', function(event){
        tab.autoplayPaused = false;
        initLoopTabAutoplay(tab);
      });
    }

    //click on a new tab -> select content
    tab.tabList.addEventListener('click', function(event) {
      if( event.target.closest('.js-loop-tabs__trigger') ) triggerLoopTab(tab, event.target.closest('.js-loop-tabs__trigger'), event);
    });

    //arrow keys to navigate through tabs
    tab.tabList.addEventListener('keydown', function(event) {
      if( !event.target.closest('.js-loop-tabs__trigger') ) return;
      if( event.keyCode && event.keyCode == 39 || event.key && event.key.toLowerCase() == 'arrowright' ) {
        pauseLoopTabAutoplay(tab);
        selectNewLoopTab(tab, 'next', true);
      } else if( event.keyCode && event.keyCode == 37 || event.key && event.key.toLowerCase() == 'arrowleft' ) {
        pauseLoopTabAutoplay(tab);
        selectNewLoopTab(tab, 'prev', true);
      }
    });
  };

  function initLoopTabAutoplay(tab) {
    if(!tab.options.autoplay || tab.autoplayPaused) return;
    tab.loopFill = 0;
    var selectedTab = tab.tabList.getElementsByClassName(tab.controlActiveClass)[0];
    // reset css variables
    for(var i = 0; i < tab.triggers.length; i++) {
      if(cssVariableSupport) tab.triggers[i].style.setProperty('--loop-tabs-filling', 0);
    }

    tab.loopTabAutoId = setTimeout(function(){
      selectNewLoopTab(tab, 'next', false);
    }, tab.options.autoplayInterval);

    if(cssVariableSupport) { // tab fill effect
      tab.loopFillAutoId = setInterval(function(){
        tab.loopFill = tab.loopFill + 0.005;
        selectedTab.style.setProperty('--loop-tabs-filling', tab.loopFill);
      }, tab.options.autoplayInterval/200);
    }
  };

  function pauseLoopTabAutoplay(tab) { // pause autoplay
    if(tab.loopTabAutoId) {
      clearTimeout(tab.loopTabAutoId);
      tab.loopTabAutoId = false;
      clearInterval(tab.loopFillAutoId);
      tab.loopFillAutoId = false;
      // make sure the filling line is scaled up
      var selectedTab = tab.tabList.getElementsByClassName(tab.controlActiveClass);
      if(selectedTab.length > 0) selectedTab[0].style.setProperty('--loop-tabs-filling', 1);
    }
  };

  function selectNewLoopTab(tab, direction, bool) {
    var selectedTab = tab.tabList.getElementsByClassName(tab.controlActiveClass)[0],
      index = Util.getIndexInArray(tab.triggers, selectedTab);
    index = (direction == 'next') ? index + 1 : index - 1;
    //make sure index is in the correct interval
    //-> from last element go to first using the right arrow, from first element go to last using the left arrow
    if(index < 0) index = tab.listItems.length - 1;
    if(index >= tab.listItems.length) index = 0;
    triggerLoopTab(tab, tab.triggers[index]);
    bool && tab.triggers[index].focus();
  };

  function triggerLoopTab(tab, tabTrigger, event) {
    pauseLoopTabAutoplay(tab);
    event && event.preventDefault();
    var index = Util.getIndexInArray(tab.triggers, tabTrigger);
    //no need to do anything if tab was already selected
    if(Util.hasClass(tab.triggers[index], tab.controlActiveClass)) return;

    for( var i = 0; i < tab.triggers.length; i++) {
      var bool = (i == index),
        exit = Util.hasClass(tab.triggers[i], tab.controlActiveClass);
      Util.toggleClass(tab.triggers[i], tab.controlActiveClass, bool);
      Util.toggleClass(tab.panels[i], tab.panelShowClass, bool);
      Util.toggleClass(featureTop, "pro-selected", bool);
      Util.toggleClass(tab.assets[i], tab.assetShowClass, bool);
      Util.toggleClass(tab.assets[i], tab.assetExitClass, exit);
      tab.triggers[i].setAttribute('aria-selected', bool);
      bool ? tab.triggers[i].setAttribute('tabindex', '0') : tab.triggers[i].setAttribute('tabindex', '-1');

      resetVideo(tab, i, bool); // play/pause video if available

      // listen for the end of animation on asset element and remove exit class
      if(exit) {(function(i){
        tab.assets[i].addEventListener('transitionend', function cb(event){
          tab.assets[i].removeEventListener('transitionend', cb);
          Util.removeClass(tab.assets[i], tab.assetExitClass);
        });
      })(i);}
    }

    // restart tab autoplay
    initLoopTabAutoplay(tab);
  };

  function resetVideo(tab, i, bool) {
    if(tab.videos[i]) {
      if(bool) {
        tab.videos[i].play();
      } else {
        tab.videos[i].pause();
        tab.videos[i].currentTime = 0;
      }
    }
  };

  LoopTab.defaults = {
    element : '',
    autoplay : true,
    autoplayInterval: 5000
  };

  //initialize the Tab objects
  var loopTabs = document.getElementsByClassName('js-loop-tabs');
  if( loopTabs.length > 0 ) {
    var reducedMotion = Util.osHasReducedMotion(),
      cssVariableSupport = ('CSS' in window) && Util.cssSupports('color', 'var(--var)');
    for( var i = 0; i < loopTabs.length; i++) {
      (function(i){
        var autoplay = (loopTabs[i].getAttribute('data-autoplay') && loopTabs[i].getAttribute('data-autoplay') == 'off' || reducedMotion) ? false : true,
        autoplayInterval = (loopTabs[i].getAttribute('data-autoplay-interval')) ? loopTabs[i].getAttribute('data-autoplay-interval') : 5000;
        new LoopTab({element: loopTabs[i], autoplay : autoplay, autoplayInterval : autoplayInterval});
      })(i);
    }
  }
}());

// File#: _1_modal-window
// Usage: codyhouse.co/license
(function() {
  var Modal = function(element) {
    this.element = element;
    this.triggers = document.querySelectorAll('[aria-controls="'+this.element.getAttribute('id')+'"]');
    this.firstFocusable = null;
    this.lastFocusable = null;
    this.moveFocusEl = null; // focus will be moved to this element when modal is open
    this.modalFocus = this.element.getAttribute('data-modal-first-focus') ? this.element.querySelector(this.element.getAttribute('data-modal-first-focus')) : null;
    this.selectedTrigger = null;
    this.preventScrollEl = this.getPreventScrollEl();
    this.showClass = "modal--is-visible";
    this.initModal();
  };

  Modal.prototype.getPreventScrollEl = function() {
    var scrollEl = false;
    var querySelector = this.element.getAttribute('data-modal-prevent-scroll');
    if(querySelector) scrollEl = document.querySelector(querySelector);
    return scrollEl;
  };

  Modal.prototype.initModal = function() {
    var self = this;
    //open modal when clicking on trigger buttons
    if ( this.triggers ) {
      for(var i = 0; i < this.triggers.length; i++) {
        this.triggers[i].addEventListener('click', function(event) {
          event.preventDefault();
          if(Util.hasClass(self.element, self.showClass)) {
            self.closeModal();
            return;
          }
          self.selectedTrigger = event.currentTarget;
          self.showModal();
          self.initModalEvents();
        });
      }
    }

    // listen to the openModal event -> open modal without a trigger button
    this.element.addEventListener('openModal', function(event){
      if(event.detail) self.selectedTrigger = event.detail;
      self.showModal();
      self.initModalEvents();
    });

    // listen to the closeModal event -> close modal without a trigger button
    this.element.addEventListener('closeModal', function(event){
      if(event.detail) self.selectedTrigger = event.detail;
      self.closeModal();
    });

    // if modal is open by default -> initialise modal events
    if(Util.hasClass(this.element, this.showClass)) this.initModalEvents();
  };

  Modal.prototype.showModal = function() {
    var self = this;
    Util.addClass(this.element, this.showClass);
    this.getFocusableElements();
    if(this.moveFocusEl) {
      this.moveFocusEl.focus();
      // wait for the end of transitions before moving focus
      this.element.addEventListener("transitionend", function cb(event) {
        self.moveFocusEl.focus();
        self.element.removeEventListener("transitionend", cb);
      });
    }
    this.emitModalEvents('modalIsOpen');
    // change the overflow of the preventScrollEl
    if(this.preventScrollEl) this.preventScrollEl.style.overflow = 'hidden';
  };

  Modal.prototype.closeModal = function() {
    if(!Util.hasClass(this.element, this.showClass)) return;
    Util.removeClass(this.element, this.showClass);
    this.firstFocusable = null;
    this.lastFocusable = null;
    this.moveFocusEl = null;
    if(this.selectedTrigger) this.selectedTrigger.focus();
    //remove listeners
    this.cancelModalEvents();
    this.emitModalEvents('modalIsClose');
    // change the overflow of the preventScrollEl
    if(this.preventScrollEl) this.preventScrollEl.style.overflow = '';
  };

  Modal.prototype.initModalEvents = function() {
    //add event listeners
    this.element.addEventListener('keydown', this);
    this.element.addEventListener('click', this);
  };

  Modal.prototype.cancelModalEvents = function() {
    //remove event listeners
    this.element.removeEventListener('keydown', this);
    this.element.removeEventListener('click', this);
  };

  Modal.prototype.handleEvent = function (event) {
    switch(event.type) {
      case 'click': {
        this.initClick(event);
      }
      case 'keydown': {
        this.initKeyDown(event);
      }
    }
  };

  Modal.prototype.initKeyDown = function(event) {
    if( event.keyCode && event.keyCode == 9 || event.key && event.key == 'Tab' ) {
      //trap focus inside modal
      this.trapFocus(event);
    } else if( (event.keyCode && event.keyCode == 13 || event.key && event.key == 'Enter') && event.target.closest('.js-modal__close')) {
      event.preventDefault();
      this.closeModal(); // close modal when pressing Enter on close button
    }
  };

  Modal.prototype.initClick = function(event) {
    //close modal when clicking on close button or modal bg layer
    if( !event.target.closest('.js-modal__close') && !Util.hasClass(event.target, 'js-modal') ) return;
    event.preventDefault();
    this.closeModal();
  };

  Modal.prototype.trapFocus = function(event) {
    if( this.firstFocusable == document.activeElement && event.shiftKey) {
      //on Shift+Tab -> focus last focusable element when focus moves out of modal
      event.preventDefault();
      this.lastFocusable.focus();
    }
    if( this.lastFocusable == document.activeElement && !event.shiftKey) {
      //on Tab -> focus first focusable element when focus moves out of modal
      event.preventDefault();
      this.firstFocusable.focus();
    }
  }

  Modal.prototype.getFocusableElements = function() {
    //get all focusable elements inside the modal
    var allFocusable = this.element.querySelectorAll(focusableElString);
    this.getFirstVisible(allFocusable);
    this.getLastVisible(allFocusable);
    this.getFirstFocusable();
  };

  Modal.prototype.getFirstVisible = function(elements) {
    //get first visible focusable element inside the modal
    for(var i = 0; i < elements.length; i++) {
      if( isVisible(elements[i]) ) {
        this.firstFocusable = elements[i];
        break;
      }
    }
  };

  Modal.prototype.getLastVisible = function(elements) {
    //get last visible focusable element inside the modal
    for(var i = elements.length - 1; i >= 0; i--) {
      if( isVisible(elements[i]) ) {
        this.lastFocusable = elements[i];
        break;
      }
    }
  };

  Modal.prototype.getFirstFocusable = function() {
    if(!this.modalFocus || !Element.prototype.matches) {
      this.moveFocusEl = this.firstFocusable;
      return;
    }
    var containerIsFocusable = this.modalFocus.matches(focusableElString);
    if(containerIsFocusable) {
      this.moveFocusEl = this.modalFocus;
    } else {
      this.moveFocusEl = false;
      var elements = this.modalFocus.querySelectorAll(focusableElString);
      for(var i = 0; i < elements.length; i++) {
        if( isVisible(elements[i]) ) {
          this.moveFocusEl = elements[i];
          break;
        }
      }
      if(!this.moveFocusEl) this.moveFocusEl = this.firstFocusable;
    }
  };

  Modal.prototype.emitModalEvents = function(eventName) {
    var event = new CustomEvent(eventName, {detail: this.selectedTrigger});
    this.element.dispatchEvent(event);
  };

  function isVisible(element) {
    return element.offsetWidth || element.offsetHeight || element.getClientRects().length;
  };

  window.Modal = Modal;

  //initialize the Modal objects
  var modals = document.getElementsByClassName('js-modal');
  // generic focusable elements string selector
  var focusableElString = '[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary';
  if( modals.length > 0 ) {
    var modalArrays = [];
    for( var i = 0; i < modals.length; i++) {
      (function(i){modalArrays.push(new Modal(modals[i]));})(i);
    }

    window.addEventListener('keydown', function(event){ //close modal window on esc
      if(event.keyCode && event.keyCode == 27 || event.key && event.key.toLowerCase() == 'escape') {
        for( var i = 0; i < modalArrays.length; i++) {
          (function(i){modalArrays[i].closeModal();})(i);
        };
      }
    });
  }
}());

// File#: _1_scrolling-animations
// Usage: codyhouse.co/license
(function() {
  var ScrollFx = function(element, scrollableSelector) {
    this.element = element;
    this.options = [];
    this.boundingRect = this.element.getBoundingClientRect();
    this.windowHeight = window.innerHeight;
    this.scrollingFx = [];
    this.animating = [];
    this.deltaScrolling = [];
    this.observer = [];
    this.scrollableSelector = scrollableSelector; // if the scrollable element is not the window
    this.scrollableElement = false;
    initScrollFx(this);
    // ToDo - option to pass two selectors to target the element start and stop animation scrolling values -> to be used for sticky/fixed elements
  };

  function initScrollFx(element) {
    // do not animate if reduced motion is on
    if(Util.osHasReducedMotion()) return;
    // get scrollable element
    setScrollableElement(element);
    // get animation params
    var animation = element.element.getAttribute('data-scroll-fx');
    if(animation) {
      element.options.push(extractAnimation(animation));
    } else {
      getAnimations(element, 1);
    }
    // set Intersection Observer
    initObserver(element);
    // update params on resize
    initResize(element);
  };

  function setScrollableElement(element) {
    if(element.scrollableSelector) element.scrollableElement = document.querySelector(element.scrollableSelector);
  };

  function initObserver(element) {
    for(var i = 0; i < element.options.length; i++) {
      (function(i){
        element.scrollingFx[i] = false;
        element.deltaScrolling[i] = getDeltaScrolling(element, i);
        element.animating[i] = false;

        element.observer[i] = new IntersectionObserver(
          function(entries, observer) {
            scrollFxCallback(element, i, entries, observer);
          },
          {
            rootMargin: (element.options[i][5] -100)+"% 0px "+(0 - element.options[i][4])+"% 0px"
          }
        );

        element.observer[i].observe(element.element);

        // set initial value
        setTimeout(function(){
          animateScrollFx.bind(element, i)();
        })
      })(i);
    }
  };

  function scrollFxCallback(element, index, entries, observer) {
    if(entries[0].isIntersecting) {
      if(element.scrollingFx[index]) return; // listener for scroll event already added
      // reset delta
      resetDeltaBeforeAnim(element, index);
      triggerAnimateScrollFx(element, index);
    } else {
      if(!element.scrollingFx[index]) return; // listener for scroll event already removed
      window.removeEventListener('scroll', element.scrollingFx[index]);
      element.scrollingFx[index] = false;
    }
  };

  function triggerAnimateScrollFx(element, index) {
    element.scrollingFx[index] = animateScrollFx.bind(element, index);
    (element.scrollableElement)
      ? element.scrollableElement.addEventListener('scroll', element.scrollingFx[index])
      : window.addEventListener('scroll', element.scrollingFx[index]);
  };

  function animateScrollFx(index) {
    // if window scroll is outside the proper range -> return
    if(getScrollY(this) < this.deltaScrolling[index][0]) {
      setCSSProperty(this, index, this.options[index][1]);
      return;
    }
    if(getScrollY(this) > this.deltaScrolling[index][1]) {
      setCSSProperty(this, index, this.options[index][2]);
      return;
    }
    if(this.animating[index]) return;
    this.animating[index] = true;
    window.requestAnimationFrame(updatePropertyScroll.bind(this, index));
  };

  function updatePropertyScroll(index) { // get value
    // check if this is a theme value or a css property
    if(isNaN(this.options[index][1])) {
      // this is a theme value to update
      (getScrollY(this) >= this.deltaScrolling[index][1])
        ? setCSSProperty(this, index, this.options[index][2])
        : setCSSProperty(this, index, this.options[index][1]);
    } else {
      // this is a CSS property
      var value = this.options[index][1] + (this.options[index][2] - this.options[index][1])*(getScrollY(this) - this.deltaScrolling[index][0])/(this.deltaScrolling[index][1] - this.deltaScrolling[index][0]);
      // update css property
      setCSSProperty(this, index, value);
    }

    this.animating[index] = false;
  };

  function setCSSProperty(element, index, value) {
    if(isNaN(value)) {
      // this is a theme value that needs to be updated
      setThemeValue(element, value);
      return;
    }
    if(element.options[index][0] == '--scroll-fx-skew' || element.options[index][0] == '--scroll-fx-scale') {
      // set 2 different CSS properties for the transformation on both x and y axis
      element.element.style.setProperty(element.options[index][0]+'-x', value+element.options[index][3]);
      element.element.style.setProperty(element.options[index][0]+'-y', value+element.options[index][3]);
    } else {
      // set single CSS property
      element.element.style.setProperty(element.options[index][0], value+element.options[index][3]);
    }
  };

  function setThemeValue(element, value) {
    // if value is different from the theme in use -> update it
    if(element.element.getAttribute('data-theme') != value) {
      Util.addClass(element.element, 'scroll-fx--theme-transition');
      element.element.offsetWidth;
      element.element.setAttribute('data-theme', value);
      element.element.addEventListener('transitionend', function cb(){
        element.element.removeEventListener('transitionend', cb);
        Util.removeClass(element.element, 'scroll-fx--theme-transition');
      });
    }
  };

  function getAnimations(element, index) {
    var option = element.element.getAttribute('data-scroll-fx-'+index);
    if(option) {
      // multiple animations for the same element - iterate through them
      element.options.push(extractAnimation(option));
      getAnimations(element, index+1);
    }
    return;
  };

  function extractAnimation(option) {
    var array = option.split(',').map(function(item) {
      return item.trim();
    });
    var propertyOptions = getPropertyValues(array[1], array[2]);
    var animation = [getPropertyLabel(array[0]), propertyOptions[0], propertyOptions[1], propertyOptions[2], parseInt(array[3]), parseInt(array[4])];
    return animation;
  };

  function getPropertyLabel(property) {
    var propertyCss = '--scroll-fx-';
    for(var i = 0; i < property.length; i++) {
      propertyCss = (property[i] == property[i].toUpperCase())
        ? propertyCss + '-'+property[i].toLowerCase()
        : propertyCss +property[i];
    }
    if(propertyCss == '--scroll-fx-rotate') {
      propertyCss = '--scroll-fx-rotate-z';
    } else if(propertyCss == '--scroll-fx-translate') {
      propertyCss = '--scroll-fx-translate-x';
    }
    return propertyCss;
  };

  function getPropertyValues(val1, val2) {
    var nbVal1 = parseFloat(val1),
      nbVal2 = parseFloat(val2),
      unit = val1.replace(nbVal1, '');
    if(isNaN(nbVal1)) {
      // property is a theme value
      nbVal1 = val1;
      nbVal2 = val2;
      unit = '';
    }
    return [nbVal1, nbVal2, unit];
  };

  function getDeltaScrolling(element, index) {
    // this retrieve the max and min scroll value that should trigger the animation
    var topDelta = getScrollY(element) - (element.windowHeight - (element.windowHeight + element.boundingRect.height)*element.options[index][4]/100) + element.boundingRect.top,
      bottomDelta = getScrollY(element) - (element.windowHeight - (element.windowHeight + element.boundingRect.height)*element.options[index][5]/100) + element.boundingRect.top;
    return [topDelta, bottomDelta];
  };

  function initResize(element) {
    var resizingId = false;
    window.addEventListener('resize', function() {
      clearTimeout(resizingId);
      resizingId = setTimeout(resetResize.bind(element), 500);
    });
    // emit custom event -> elements have been initialized
    var event = new CustomEvent('scrollFxReady');
    element.element.dispatchEvent(event);
  };

  function resetResize() {
    // on resize -> make sure to update all scrolling delta values
    this.boundingRect = this.element.getBoundingClientRect();
    this.windowHeight = window.innerHeight;
    for(var i = 0; i < this.deltaScrolling.length; i++) {
      this.deltaScrolling[i] = getDeltaScrolling(this, i);
      animateScrollFx.bind(this, i)();
    }
    // emit custom event -> elements have been resized
    var event = new CustomEvent('scrollFxResized');
    this.element.dispatchEvent(event);
  };

  function resetDeltaBeforeAnim(element, index) {
    element.boundingRect = element.element.getBoundingClientRect();
    element.windowHeight = window.innerHeight;
    element.deltaScrolling[index] = getDeltaScrolling(element, index);
  };

  function getScrollY(element) {
    if(!element.scrollableElement) return window.scrollY;
    return element.scrollableElement.scrollTop;
  }

  window.ScrollFx = ScrollFx;

  var scrollFx = document.getElementsByClassName('js-scroll-fx');
  for(var i = 0; i < scrollFx.length; i++) {
    (function(i){
      var scrollableElement = scrollFx[i].getAttribute('data-scrollable-element');
      new ScrollFx(scrollFx[i], scrollableElement);
    })(i);
  }
}());

// File#: _1_swipe-content
(function() {
  var SwipeContent = function(element) {
    this.element = element;
    this.delta = [false, false];
    this.dragging = false;
    this.intervalId = false;
    initSwipeContent(this);
  };

  function initSwipeContent(content) {
    content.element.addEventListener('mousedown', handleEvent.bind(content));
    content.element.addEventListener('touchstart', handleEvent.bind(content), {passive: true});
  };

  function initDragging(content) {
    //add event listeners
    content.element.addEventListener('mousemove', handleEvent.bind(content));
    content.element.addEventListener('touchmove', handleEvent.bind(content), {passive: true});
    content.element.addEventListener('mouseup', handleEvent.bind(content));
    content.element.addEventListener('mouseleave', handleEvent.bind(content));
    content.element.addEventListener('touchend', handleEvent.bind(content));
  };

  function cancelDragging(content) {
    //remove event listeners
    if(content.intervalId) {
      (!window.requestAnimationFrame) ? clearInterval(content.intervalId) : window.cancelAnimationFrame(content.intervalId);
      content.intervalId = false;
    }
    content.element.removeEventListener('mousemove', handleEvent.bind(content));
    content.element.removeEventListener('touchmove', handleEvent.bind(content));
    content.element.removeEventListener('mouseup', handleEvent.bind(content));
    content.element.removeEventListener('mouseleave', handleEvent.bind(content));
    content.element.removeEventListener('touchend', handleEvent.bind(content));
  };

  function handleEvent(event) {
    switch(event.type) {
      case 'mousedown':
      case 'touchstart':
        startDrag(this, event);
        break;
      case 'mousemove':
      case 'touchmove':
        drag(this, event);
        break;
      case 'mouseup':
      case 'mouseleave':
      case 'touchend':
        endDrag(this, event);
        break;
    }
  };

  function startDrag(content, event) {
    content.dragging = true;
    // listen to drag movements
    initDragging(content);
    content.delta = [parseInt(unify(event).clientX), parseInt(unify(event).clientY)];
    // emit drag start event
    emitSwipeEvents(content, 'dragStart', content.delta, event.target);
  };

  function endDrag(content, event) {
    cancelDragging(content);
    // credits: https://css-tricks.com/simple-swipe-with-vanilla-javascript/
    var dx = parseInt(unify(event).clientX),
      dy = parseInt(unify(event).clientY);

    // check if there was a left/right swipe
    if(content.delta && (content.delta[0] || content.delta[0] === 0)) {
      var s = getSign(dx - content.delta[0]);

      if(Math.abs(dx - content.delta[0]) > 30) {
        (s < 0) ? emitSwipeEvents(content, 'swipeLeft', [dx, dy]) : emitSwipeEvents(content, 'swipeRight', [dx, dy]);
      }

      content.delta[0] = false;
    }
    // check if there was a top/bottom swipe
    if(content.delta && (content.delta[1] || content.delta[1] === 0)) {
    	var y = getSign(dy - content.delta[1]);

    	if(Math.abs(dy - content.delta[1]) > 30) {
      	(y < 0) ? emitSwipeEvents(content, 'swipeUp', [dx, dy]) : emitSwipeEvents(content, 'swipeDown', [dx, dy]);
      }

      content.delta[1] = false;
    }
    // emit drag end event
    emitSwipeEvents(content, 'dragEnd', [dx, dy]);
    content.dragging = false;
  };

  function drag(content, event) {
    if(!content.dragging) return;
    // emit dragging event with coordinates
    (!window.requestAnimationFrame)
      ? content.intervalId = setTimeout(function(){emitDrag.bind(content, event);}, 250)
      : content.intervalId = window.requestAnimationFrame(emitDrag.bind(content, event));
  };

  function emitDrag(event) {
    emitSwipeEvents(this, 'dragging', [parseInt(unify(event).clientX), parseInt(unify(event).clientY)]);
  };

  function unify(event) {
    // unify mouse and touch events
    return event.changedTouches ? event.changedTouches[0] : event;
  };

  function emitSwipeEvents(content, eventName, detail, el) {
    var trigger = false;
    if(el) trigger = el;
    // emit event with coordinates
    var event = new CustomEvent(eventName, {detail: {x: detail[0], y: detail[1], origin: trigger}});
    content.element.dispatchEvent(event);
  };

  function getSign(x) {
    if(!Math.sign) {
      return ((x > 0) - (x < 0)) || +x;
    } else {
      return Math.sign(x);
    }
  };

  window.SwipeContent = SwipeContent;

  //initialize the SwipeContent objects
  var swipe = document.getElementsByClassName('js-swipe-content');
  if( swipe.length > 0 ) {
    for( var i = 0; i < swipe.length; i++) {
      (function(i){new SwipeContent(swipe[i]);})(i);
    }
  }
}());

// File#: _1_tilted-img-slideshow
// Usage: codyhouse.co/license
(function() {
  var TiltedSlideshow = function(element) {
    this.element = element;
    this.list = this.element.getElementsByClassName('js-tilted-slideshow__list')[0];
    this.images = this.list.getElementsByClassName('js-tilted-slideshow__item');
    this.selectedIndex = 0;
    this.animating = false;
    // classes
    this.orderClasses = ['tilted-slideshow__item--top', 'tilted-slideshow__item--middle', 'tilted-slideshow__item--bottom'];
    this.moveClasses = ['tilted-slideshow__item--move-out', 'tilted-slideshow__item--move-in'];
    this.interactedClass = 'tilted-slideshow--interacted';
    initTiltedSlideshow(this);
  };

  function initTiltedSlideshow(slideshow) {
    if(!animateImgs) removeTransitions(slideshow);

    slideshow.list.addEventListener('click', function(event) {
      Util.addClass(slideshow.element, slideshow.interactedClass);
      animateImgs ? animateImages(slideshow) : switchImages(slideshow);
    });
  };

  function removeTransitions(slideshow) {
    // if reduced motion is on or css variables are not supported -> do not animate images
    for(var i = 0; i < slideshow.images.length; i++) {
      slideshow.images[i].style.transition = 'none';
    }
  };

  function switchImages(slideshow) {
    // if reduced motion is on or css variables are not supported -> switch images without animation
    resetOrderClasses(slideshow);
    resetSelectedIndex(slideshow);
  };

  function resetSelectedIndex(slideshow) {
    // update the index of the top image
    slideshow.selectedIndex = resetIndex(slideshow, slideshow.selectedIndex + 1);
  };

  function resetIndex(slideshow, index) {
    // make sure index is < 3
    if(index >= slideshow.images.length) index = index - slideshow.images.length;
    return index;
  };

  function resetOrderClasses(slideshow) {
    // update the orderClasses for each images
    if(!animateImgs) {
      // top image -> remove top class and add bottom class
      Util.addClass(slideshow.images[slideshow.selectedIndex], slideshow.orderClasses[2]);
      Util.removeClass(slideshow.images[slideshow.selectedIndex], slideshow.orderClasses[0]);
    }

    // middle image -> remove middle class and add top class
    var middleImage = slideshow.images[resetIndex(slideshow, slideshow.selectedIndex + 1)];
    Util.addClass(middleImage, slideshow.orderClasses[0]);
    Util.removeClass(middleImage, slideshow.orderClasses[1]);

    // bottom image -> remove bottom class and add middle class
    var bottomImage = slideshow.images[resetIndex(slideshow, slideshow.selectedIndex + 2)];
    Util.addClass(bottomImage, slideshow.orderClasses[1]);
    Util.removeClass(bottomImage, slideshow.orderClasses[2]);
  };

  function animateImages(slideshow) {
    if(slideshow.animating) return;
    slideshow.animating = true;

    // reset order classes for middle/bottom images
    resetOrderClasses(slideshow);

    // animate top image
    var topImage = slideshow.images[slideshow.selectedIndex];
    // remove top class and add move out class
    Util.removeClass(topImage, slideshow.orderClasses[0]);
    Util.addClass(topImage, slideshow.moveClasses[0]);

    topImage.addEventListener('transitionend', function cb(event) {
      // remove transition
      topImage.style.transition = 'none';
      topImage.removeEventListener("transitionend", cb);

      setTimeout(function(){
        // add bottom + move-in class, remove move-out class
        Util.removeClass(topImage, slideshow.moveClasses[0]);
        Util.addClass(topImage, slideshow.moveClasses[1]+' '+ slideshow.orderClasses[2]);
        setTimeout(function(){
          topImage.style.transition = '';
          // remove move-in class
          Util.removeClass(topImage, slideshow.moveClasses[1]);
          topImage.addEventListener('transitionend', function cbn(event) {
            // reset animating property and selectedIndex index
            resetSelectedIndex(slideshow);
            slideshow.animating = false;
            topImage.removeEventListener("transitionend", cbn);
          });
        }, 10);
      }, 10);
    });
  };

  var tiltedSlideshow = document.getElementsByClassName('js-tilted-slideshow'),
    animateImgs = !Util.osHasReducedMotion() && ('CSS' in window) && CSS.supports('color', 'var(--color-var)');
  if(tiltedSlideshow.length > 0) {
    for(var i = 0; i < tiltedSlideshow.length; i++) {
      new TiltedSlideshow(tiltedSlideshow[i]);
    }
  }
}());

// File#: _2_modal-video
// Usage: codyhouse.co/license
(function() {
  var ModalVideo = function(element) {
    this.element = element;
    this.modalContent = this.element.getElementsByClassName('js-modal-video__content')[0];
    this.media = this.element.getElementsByClassName('js-modal-video__media')[0];
    this.contentIsIframe = this.media.tagName.toLowerCase() == 'iframe';
    this.modalIsOpen = false;
    this.initModalVideo();
  };

  ModalVideo.prototype.initModalVideo = function() {
    var self = this;
    // reveal modal content when iframe is ready
    this.addLoadListener();
    // listen for the modal element to be open -> set new iframe src attribute
    this.element.addEventListener('modalIsOpen', function(event){
      self.modalIsOpen = true;
      self.media.setAttribute('src', event.detail.closest('[aria-controls]').getAttribute('data-url'));
    });
    // listen for the modal element to be close -> reset iframe and hide modal content
    this.element.addEventListener('modalIsClose', function(event){
      self.modalIsOpen = false;
      Util.addClass(self.element, 'modal--is-loading');
      self.media.setAttribute('src', '');
    });
  };

  ModalVideo.prototype.addLoadListener = function() {
    var self = this;
    if(this.contentIsIframe) {
      this.media.onload = function () {
        self.revealContent();
      };
    } else {
      this.media.addEventListener('loadedmetadata', function(){
        self.revealContent();
      });
    }

  };

  ModalVideo.prototype.revealContent = function() {
    if( !this.modalIsOpen ) return;
    Util.removeClass(this.element, 'modal--is-loading');
    this.contentIsIframe ? this.media.contentWindow.focus() : this.media.focus();
  };

  //initialize the ModalVideo objects
  var modalVideos = document.getElementsByClassName('js-modal-video__media');
  if( modalVideos.length > 0 ) {
    for( var i = 0; i < modalVideos.length; i++) {
      (function(i){new ModalVideo(modalVideos[i].closest('.js-modal'));})(i);
    }
  }
}());

// File#: _2_morphing-image-modal
// Usage: codyhouse.co/license
(function() {
  var MorphImgModal = function(opts) {
    this.options = Util.extend(MorphImgModal.defaults, opts);
    this.element = this.options.element;
    this.modalId = this.element.getAttribute('id');
    this.triggers = document.querySelectorAll('[aria-controls="'+this.modalId+'"]');
    this.selectedImg = false;
    // store morph elements
    this.morphBg = document.getElementsByClassName('js-morph-img-bg');
    this.morphImg = document.getElementsByClassName('js-morph-img-clone');
    // store modal content
    this.modalContent = this.element.getElementsByClassName('js-morph-img-modal__content');
    this.modalImg = this.element.getElementsByClassName('js-morph-img-modal__img');
    this.modalInfo = this.element.getElementsByClassName('js-morph-img-modal__info');
    // store close btn element
    this.modalCloseBtn = document.getElementsByClassName('js-morph-img-close-btn');
    // animation duration
    this.animationDuration = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--morph-img-modal-transition-duration'))*1000 || 300;
    // morphing animation should run
    this.animating = false;
    this.reset = false;
    initMorphModal(this);
  };

  function initMorphModal(element) {
    if(element.morphImg.length < 1) return;
    element.morphEl = element.morphImg[0].getElementsByTagName('image');
    element.morphRect  = element.morphImg[0].getElementsByTagName('rect');
    initMorphModalMarkup(element);
    initMorphModalEvents(element);
  };

  function initMorphModalMarkup(element) {
    // append the clip path + <image> elements to use to morph the image
    element.morphImg[0].innerHTML = '<svg><defs><clipPath id="'+element.modalId+'-clip"><rect/></clipPath></defs><image height="100%" width="100%" clip-path="url(#'+element.modalId+'-clip)"></image></svg>';
  };

  function initMorphModalEvents(element) {
    // morph modal was open
    element.element.addEventListener('modalIsOpen', function(event){
      var target = event.detail.closest('[aria-controls="'+element.modalId+'"]');
      setModalImg(element, target);
      setModalContent(element, target);
      toggleModalCloseBtn(element, true);
    });

    // morph modal was closed
    element.element.addEventListener('modalIsClose', function(event){
      element.reset = false;
      element.animating = true;
      Util.addClass(element.modalContent[0], 'opacity-0');
      animateImg(element, false, function() {
        if(element.reset) return; // user opened a new modal before the animation was complete - no need to reset the modal
        element.selectedImg = false;
        resetMorphModal(element, false);
        element.animating = false;
      });
      toggleModalCloseBtn(element, false);
    });

    // close modal clicking on close btn
    if(element.modalCloseBtn.length > 0) {
      element.modalCloseBtn[0].addEventListener('click', function(event) {
        element.element.click();
      });
    }
  };

  function setModalImg(element, target) {
    if(!target) return;
    element.selectedImg = (target.tagName.toLowerCase() == 'img') ? target : target.querySelector('img');
    var src = element.selectedImg.getAttribute('data-modal-src') || element.selectedImg.getAttribute('src');
    // update url modal image + morph
    if(element.modalImg.length > 0) element.modalImg[0].setAttribute('src', src);
    Util.setAttributes(element.morphEl[0], {'xlink:href': src, 'href': src});
    element.reset = false;
    element.animating = true;
    // wait for image to be loaded, then animate
    loadImage(element, src, function() {
      animateImg(element, true, function() {
        if(element.reset) return; // user closed the modal before the animation was complete - no need to reset the modal
        resetMorphModal(element, true);
        element.animating = false;
      });
    });
  };

  function loadImage(element, src, cb) {
    var image = new Image();
    var loaded = false;
    image.onload = function () {
      if(loaded) return;
      cb();
    }
    image.src = src;
    if(image.complete) {
      loaded = true;
      cb();
    }
  };

  function setModalContent(element, target) {
    // load the modal info details - using the searchData custom function the user defines
    if(element.modalInfo.length < 1) return;
    element.options.searchData(target, function(data){
      element.modalInfo[0].innerHTML = data;
    });
  };

  function toggleModalCloseBtn(element, bool) {
    if(element.modalCloseBtn.length > 0) {
      Util.toggleClass(element.modalCloseBtn[0], 'morph-img-close-btn--is-visible', bool);
    }
  };

  function animateImg(element, isOpening, cb) {
    Util.removeClass(element.morphImg[0], 'is-hidden');

    var galleryImgRect = element.selectedImg.getBoundingClientRect(),
      modalImgRect = element.modalImg[0].getBoundingClientRect();

    runClipAnimation(element, galleryImgRect, modalImgRect, isOpening, cb);
  };

  function runClipAnimation(element, startRect, endRect, isOpening, cb) {
    // retrieve all animation params
    // main element animation (<div>)
    var elInitHeight = startRect.height,
      elIntWidth = startRect.width,
      elInitTop = startRect.top,
      elInitLeft = startRect.left;

    var elScale = Math.max(endRect.height/startRect.height, endRect.width/startRect.width);

    var elTranslateX = endRect.left - startRect.left + (endRect.width - startRect.width*elScale)*0.5,
      elTranslateY = endRect.top - startRect.top + (endRect.height - startRect.height*elScale)*0.5;

    // clip <rect> animation
    var rectScaleX = endRect.width/(startRect.width*elScale),
      rectScaleY = endRect.height/(startRect.height*elScale);

    element.morphImg[0].style = 'height:'+elInitHeight+'px; width:'+elIntWidth+'px; top:'+elInitTop+'px; left:'+elInitLeft+'px;';

    element.morphRect[0].setAttribute('transform', 'scale('+1+','+1+')');

    // init morph bg
    element.morphBg[0].style.height = startRect.height + 'px';
    element.morphBg[0].style.width = startRect.width + 'px';
    element.morphBg[0].style.top = startRect.top + 'px';
    element.morphBg[0].style.left = startRect.left + 'px';

    Util.removeClass(element.morphBg[0], 'is-hidden');

    animateRectScale(element, elInitHeight, elIntWidth, elScale, elTranslateX, elTranslateY, rectScaleX, rectScaleY, isOpening, cb);
  };

  function animateRectScale(element, height, width, elScale, elTranslateX, elTranslateY, rectScaleX, rectScaleY, isOpening, cb) {
    var isMobile = getComputedStyle(element.element, ':before').getPropertyValue('content').replace(/\'|"/g, '') == 'mobile';

    var currentTime = null,
      duration =  element.animationDuration;

    var startRect = element.selectedImg.getBoundingClientRect(),
      endRect = element.modalContent[0].getBoundingClientRect();

    var scaleX = endRect.width/startRect.width,
      scaleY = endRect.height/startRect.height;

    var translateX = endRect.left - startRect.left,
      translateY = endRect.top - startRect.top;

    var animateScale = function(timestamp){
      if (!currentTime) currentTime = timestamp;
      var progress = timestamp - currentTime;
      if(progress > duration) progress = duration;

      // main element values
      if(isOpening) {
        var elScalePr = Math.easeOutQuart(progress, 1, elScale - 1, duration),
        elTransXPr = Math.easeOutQuart(progress, 0, elTranslateX, duration),
        elTransYPr = Math.easeOutQuart(progress, 0, elTranslateY, duration);
      } else {
        var elScalePr = Math.easeOutQuart(progress, elScale, 1 - elScale, duration),
        elTransXPr = Math.easeOutQuart(progress, elTranslateX, - elTranslateX, duration),
        elTransYPr = Math.easeOutQuart(progress, elTranslateY, - elTranslateY, duration);
      }

      // rect values
      if(isOpening) {
        var rectScaleXPr = Math.easeOutQuart(progress, 1, rectScaleX - 1, duration),
          rectScaleYPr = Math.easeOutQuart(progress, 1, rectScaleY - 1, duration);
      } else {
        var rectScaleXPr = Math.easeOutQuart(progress, rectScaleX,  1 - rectScaleX, duration),
          rectScaleYPr = Math.easeOutQuart(progress, rectScaleY, 1 - rectScaleY, duration);
      }

      element.morphImg[0].style.transform = 'translateX('+elTransXPr+'px) translateY('+elTransYPr+'px) scale('+elScalePr+')';

      element.morphRect[0].setAttribute('transform', 'translate('+(width/2)*(1 - rectScaleXPr)+' '+(height/2)*(1 - rectScaleYPr)+') scale('+rectScaleXPr+','+rectScaleYPr+')');

      if(isOpening) {
        var valScaleX = Math.easeOutQuart(progress, 1, (scaleX - 1), duration),
          valScaleY = isMobile ? Math.easeOutQuart(progress, 1, (scaleY - 1), duration): rectScaleYPr*elScalePr,
          valTransX = Math.easeOutQuart(progress, 0, translateX, duration),
          valTransY = isMobile ? Math.easeOutQuart(progress, 0, translateY, duration) : elTransYPr + (elScalePr*height - rectScaleYPr*elScalePr*height)/2;
      } else {
        var valScaleX = Math.easeOutQuart(progress, scaleX, 1 - scaleX, duration),
          valScaleY = isMobile ? Math.easeOutQuart(progress, scaleY, 1 - scaleY, duration) : rectScaleYPr*elScalePr,
          valTransX = Math.easeOutQuart(progress, translateX, - translateX, duration),
          valTransY = isMobile ? Math.easeOutQuart(progress, translateY, - translateY, duration) : elTransYPr + (elScalePr*height - rectScaleYPr*elScalePr*height)/2;
      }

      // morph bg
      element.morphBg[0].style.transform = 'translateX('+valTransX+'px) translateY('+valTransY+'px) scale('+valScaleX+','+valScaleY+')';

      if(progress < duration) {
        window.requestAnimationFrame(animateScale);
      } else if(cb) {
        cb();
      }
    };

    window.requestAnimationFrame(animateScale);
  };

  function resetMorphModal(element, isOpening) {
    // reset modal at the end of an opening/closing animation
    Util.toggleClass(element.modalContent[0], 'opacity-0', !isOpening);
    Util.toggleClass(element.modalInfo[0], 'opacity-0', !isOpening);
    Util.addClass(element.morphBg[0], 'is-hidden');
    Util.addClass(element.morphImg[0], 'is-hidden');
    if(!isOpening) {
      element.modalImg[0].removeAttribute('src');
      element.modalInfo[0].innerHTML = '';
      element.morphEl[0].removeAttribute('xlink:href');
      element.morphEl[0].removeAttribute('href');
      element.morphBg[0].removeAttribute('style');
      element.morphImg[0].removeAttribute('style');
    }
  };

  window.MorphImgModal = MorphImgModal;

  MorphImgModal.defaults = {
    element : '',
    searchData: false, // function used to return results
  };


  //
  // my custom implementation
  /*
  var morphModal = document.getElementsByClassName('js-morph-img-modal')[0];

  var modalContent1 = document.getElementById('morph-content-1');
  var modalContent2 = document.getElementById('morph-content-2');
  var modalContent3 = document.getElementById('morph-content-3');
  var modalContent4 = document.getElementById('morph-content-4');

  var searchValues = [
    {id: 1, content: modalContent1.innerHTML},
    {id: 2, content: modalContent2.innerHTML},
    {id: 3, content: modalContent3.innerHTML},
    {id: 4, content: modalContent3.innerHTML}
  ];

  new MorphImgModal({
    element: morphModal,
    searchData: function(trigger, cb) {
      var imageId = trigger.getAttribute('data-morph-img') || 1;
      var data = searchValues.filter(function(item){
        return item['id'] == imageId;
      });
      cb(data[0]['content']);
    }
  });

  */

}());

// File#: _2_slideshow
// Usage: codyhouse.co/license
(function() {
  var Slideshow = function(opts) {
    this.options = Util.extend(Slideshow.defaults , opts);
    this.element = this.options.element;
    this.items = this.element.getElementsByClassName('js-slideshow__item');
    this.controls = this.element.getElementsByClassName('js-slideshow__control');
    this.selectedSlide = 0;
    this.autoplayId = false;
    this.autoplayPaused = false;
    this.navigation = false;
    this.navCurrentLabel = false;
    this.ariaLive = false;
    this.moveFocus = false;
    this.animating = false;
    this.supportAnimation = Util.cssSupports('transition');
    this.animationOff = (!Util.hasClass(this.element, 'slideshow--transition-fade') && !Util.hasClass(this.element, 'slideshow--transition-slide') && !Util.hasClass(this.element, 'slideshow--transition-prx'));
    this.animationType = Util.hasClass(this.element, 'slideshow--transition-prx') ? 'prx' : 'slide';
    this.animatingClass = 'slideshow--is-animating';
    initSlideshow(this);
    initSlideshowEvents(this);
    initAnimationEndEvents(this);
  };

  Slideshow.prototype.showNext = function() {
    showNewItem(this, this.selectedSlide + 1, 'next');
  };

  Slideshow.prototype.showPrev = function() {
    showNewItem(this, this.selectedSlide - 1, 'prev');
  };

  Slideshow.prototype.showItem = function(index) {
    showNewItem(this, index, false);
  };

  Slideshow.prototype.startAutoplay = function() {
    var self = this;
    if(this.options.autoplay && !this.autoplayId && !this.autoplayPaused) {
      self.autoplayId = setInterval(function(){
        self.showNext();
      }, self.options.autoplayInterval);
    }
  };

  Slideshow.prototype.pauseAutoplay = function() {
    var self = this;
    if(this.options.autoplay) {
      clearInterval(self.autoplayId);
      self.autoplayId = false;
    }
  };

  function initSlideshow(slideshow) { // basic slideshow settings
    // if no slide has been selected -> select the first one
    if(slideshow.element.getElementsByClassName('slideshow__item--selected').length < 1) Util.addClass(slideshow.items[0], 'slideshow__item--selected');
    slideshow.selectedSlide = Util.getIndexInArray(slideshow.items, slideshow.element.getElementsByClassName('slideshow__item--selected')[0]);
    // create an element that will be used to announce the new visible slide to SR
    var srLiveArea = document.createElement('div');
    Util.setAttributes(srLiveArea, {'class': 'sr-only js-slideshow__aria-live', 'aria-live': 'polite', 'aria-atomic': 'true'});
    slideshow.element.appendChild(srLiveArea);
    slideshow.ariaLive = srLiveArea;
  };

  function initSlideshowEvents(slideshow) {
    // if slideshow navigation is on -> create navigation HTML and add event listeners
    if(slideshow.options.navigation) {
      // check if navigation has already been included
      if(slideshow.element.getElementsByClassName('js-slideshow__navigation').length == 0) {
        var navigation = document.createElement('ol'),
          navChildren = '';

        var navClasses = slideshow.options.navigationClass+' js-slideshow__navigation';
        if(slideshow.items.length <= 1) {
          navClasses = navClasses + ' is-hidden';
        }

        navigation.setAttribute('class', navClasses);
        for(var i = 0; i < slideshow.items.length; i++) {
          var className = (i == slideshow.selectedSlide) ? 'class="'+slideshow.options.navigationItemClass+' '+slideshow.options.navigationItemClass+'--selected js-slideshow__nav-item"' :  'class="'+slideshow.options.navigationItemClass+' js-slideshow__nav-item"',
            navCurrentLabel = (i == slideshow.selectedSlide) ? '<span class="sr-only js-slideshow__nav-current-label">Current Item</span>' : '';
          navChildren = navChildren + '<li '+className+'><button class="reset"><span class="sr-only">'+ (i+1) + '</span>'+navCurrentLabel+'</button></li>';
        }
        navigation.innerHTML = navChildren;
        slideshow.element.appendChild(navigation);
      }

      slideshow.navCurrentLabel = slideshow.element.getElementsByClassName('js-slideshow__nav-current-label')[0];
      slideshow.navigation = slideshow.element.getElementsByClassName('js-slideshow__nav-item');

      var dotsNavigation = slideshow.element.getElementsByClassName('js-slideshow__navigation')[0];

      dotsNavigation.addEventListener('click', function(event){
        navigateSlide(slideshow, event, true);
      });
      dotsNavigation.addEventListener('keyup', function(event){
        navigateSlide(slideshow, event, (event.key.toLowerCase() == 'enter'));
      });
    }
    // slideshow arrow controls
    if(slideshow.controls.length > 0) {
      // hide controls if one item available
      if(slideshow.items.length <= 1) {
        Util.addClass(slideshow.controls[0], 'is-hidden');
        Util.addClass(slideshow.controls[1], 'is-hidden');
      }
      slideshow.controls[0].addEventListener('click', function(event){
        event.preventDefault();
        slideshow.showPrev();
        updateAriaLive(slideshow);
      });
      slideshow.controls[1].addEventListener('click', function(event){
        event.preventDefault();
        slideshow.showNext();
        updateAriaLive(slideshow);
      });
    }
    // swipe events
    if(slideshow.options.swipe) {
      //init swipe
      new SwipeContent(slideshow.element);
      slideshow.element.addEventListener('swipeLeft', function(event){
        slideshow.showNext();
      });
      slideshow.element.addEventListener('swipeRight', function(event){
        slideshow.showPrev();
      });
    }
    // autoplay
    if(slideshow.options.autoplay) {
      slideshow.startAutoplay();
      // pause autoplay if user is interacting with the slideshow
      if(!slideshow.options.autoplayOnHover) {
        slideshow.element.addEventListener('mouseenter', function(event){
          slideshow.pauseAutoplay();
          slideshow.autoplayPaused = true;
        });
        slideshow.element.addEventListener('mouseleave', function(event){
          slideshow.autoplayPaused = false;
          slideshow.startAutoplay();
        });
      }
      if(!slideshow.options.autoplayOnFocus) {
        slideshow.element.addEventListener('focusin', function(event){
          slideshow.pauseAutoplay();
          slideshow.autoplayPaused = true;
        });
        slideshow.element.addEventListener('focusout', function(event){
          slideshow.autoplayPaused = false;
          slideshow.startAutoplay();
        });
      }
    }
    // detect if external buttons control the slideshow
    var slideshowId = slideshow.element.getAttribute('id');
    if(slideshowId) {
      var externalControls = document.querySelectorAll('[data-controls="'+slideshowId+'"]');
      for(var i = 0; i < externalControls.length; i++) {
        (function(i){externalControlSlide(slideshow, externalControls[i]);})(i);
      }
    }
    // custom event to trigger selection of a new slide element
    slideshow.element.addEventListener('selectNewItem', function(event){
      // check if slide is already selected
      if(event.detail) {
        if(event.detail - 1 == slideshow.selectedSlide) return;
        showNewItem(slideshow, event.detail - 1, false);
      }
    });

    // keyboard navigation
    slideshow.element.addEventListener('keydown', function(event){
      if(event.keyCode && event.keyCode == 39 || event.key && event.key.toLowerCase() == 'arrowright') {
        slideshow.showNext();
      } else if(event.keyCode && event.keyCode == 37 || event.key && event.key.toLowerCase() == 'arrowleft') {
        slideshow.showPrev();
      }
    });
  };

  function navigateSlide(slideshow, event, keyNav) {
    // user has interacted with the slideshow navigation -> update visible slide
    var target = ( Util.hasClass(event.target, 'js-slideshow__nav-item') ) ? event.target : event.target.closest('.js-slideshow__nav-item');
    if(keyNav && target && !Util.hasClass(target, 'slideshow__nav-item--selected')) {
      slideshow.showItem(Util.getIndexInArray(slideshow.navigation, target));
      slideshow.moveFocus = true;
      updateAriaLive(slideshow);
    }
  };

  function initAnimationEndEvents(slideshow) {
    // remove animation classes at the end of a slide transition
    for( var i = 0; i < slideshow.items.length; i++) {
      (function(i){
        slideshow.items[i].addEventListener('animationend', function(){resetAnimationEnd(slideshow, slideshow.items[i]);});
        slideshow.items[i].addEventListener('transitionend', function(){resetAnimationEnd(slideshow, slideshow.items[i]);});
      })(i);
    }
  };

  function resetAnimationEnd(slideshow, item) {
    setTimeout(function(){ // add a delay between the end of animation and slideshow reset - improve animation performance
      if(Util.hasClass(item,'slideshow__item--selected')) {
        if(slideshow.moveFocus) Util.moveFocus(item);
        emitSlideshowEvent(slideshow, 'newItemVisible', slideshow.selectedSlide);
        slideshow.moveFocus = false;
      }
      Util.removeClass(item, 'slideshow__item--'+slideshow.animationType+'-out-left slideshow__item--'+slideshow.animationType+'-out-right slideshow__item--'+slideshow.animationType+'-in-left slideshow__item--'+slideshow.animationType+'-in-right');
      item.removeAttribute('aria-hidden');
      slideshow.animating = false;
      Util.removeClass(slideshow.element, slideshow.animatingClass);
    }, 100);
  };

  function showNewItem(slideshow, index, bool) {
    if(slideshow.items.length <= 1) return;
    if(slideshow.animating && slideshow.supportAnimation) return;
    slideshow.animating = true;
    Util.addClass(slideshow.element, slideshow.animatingClass);
    if(index < 0) index = slideshow.items.length - 1;
    else if(index >= slideshow.items.length) index = 0;
    // skip slideshow item if it is hidden
    if(bool && Util.hasClass(slideshow.items[index], 'is-hidden')) {
      slideshow.animating = false;
      index = bool == 'next' ? index + 1 : index - 1;
      showNewItem(slideshow, index, bool);
      return;
    }
    // index of new slide is equal to index of slide selected item
    if(index == slideshow.selectedSlide) {
      slideshow.animating = false;
      return;
    }
    var exitItemClass = getExitItemClass(slideshow, bool, slideshow.selectedSlide, index);
    var enterItemClass = getEnterItemClass(slideshow, bool, slideshow.selectedSlide, index);
    // transition between slides
    if(!slideshow.animationOff) Util.addClass(slideshow.items[slideshow.selectedSlide], exitItemClass);
    Util.removeClass(slideshow.items[slideshow.selectedSlide], 'slideshow__item--selected');
    slideshow.items[slideshow.selectedSlide].setAttribute('aria-hidden', 'true'); //hide to sr element that is exiting the viewport
    if(slideshow.animationOff) {
      Util.addClass(slideshow.items[index], 'slideshow__item--selected');
    } else {
      Util.addClass(slideshow.items[index], enterItemClass+' slideshow__item--selected');
    }
    // reset slider navigation appearance
    resetSlideshowNav(slideshow, index, slideshow.selectedSlide);
    slideshow.selectedSlide = index;
    // reset autoplay
    slideshow.pauseAutoplay();
    slideshow.startAutoplay();
    // reset controls/navigation color themes
    resetSlideshowTheme(slideshow, index);
    // emit event
    emitSlideshowEvent(slideshow, 'newItemSelected', slideshow.selectedSlide);
    if(slideshow.animationOff) {
      slideshow.animating = false;
      Util.removeClass(slideshow.element, slideshow.animatingClass);
    }
  };

  function getExitItemClass(slideshow, bool, oldIndex, newIndex) {
    var className = '';
    if(bool) {
      className = (bool == 'next') ? 'slideshow__item--'+slideshow.animationType+'-out-right' : 'slideshow__item--'+slideshow.animationType+'-out-left';
    } else {
      className = (newIndex < oldIndex) ? 'slideshow__item--'+slideshow.animationType+'-out-left' : 'slideshow__item--'+slideshow.animationType+'-out-right';
    }
    return className;
  };

  function getEnterItemClass(slideshow, bool, oldIndex, newIndex) {
    var className = '';
    if(bool) {
      className = (bool == 'next') ? 'slideshow__item--'+slideshow.animationType+'-in-right' : 'slideshow__item--'+slideshow.animationType+'-in-left';
    } else {
      className = (newIndex < oldIndex) ? 'slideshow__item--'+slideshow.animationType+'-in-left' : 'slideshow__item--'+slideshow.animationType+'-in-right';
    }
    return className;
  };

  function resetSlideshowNav(slideshow, newIndex, oldIndex) {
    if(slideshow.navigation) {
      Util.removeClass(slideshow.navigation[oldIndex], 'slideshow__nav-item--selected');
      Util.addClass(slideshow.navigation[newIndex], 'slideshow__nav-item--selected');
      slideshow.navCurrentLabel.parentElement.removeChild(slideshow.navCurrentLabel);
      slideshow.navigation[newIndex].getElementsByTagName('button')[0].appendChild(slideshow.navCurrentLabel);
    }
  };

  function resetSlideshowTheme(slideshow, newIndex) {
    var dataTheme = slideshow.items[newIndex].getAttribute('data-theme');
    if(dataTheme) {
      if(slideshow.navigation) slideshow.navigation[0].parentElement.setAttribute('data-theme', dataTheme);
      if(slideshow.controls[0]) slideshow.controls[0].parentElement.setAttribute('data-theme', dataTheme);
    } else {
      if(slideshow.navigation) slideshow.navigation[0].parentElement.removeAttribute('data-theme');
      if(slideshow.controls[0]) slideshow.controls[0].parentElement.removeAttribute('data-theme');
    }
  };

  function emitSlideshowEvent(slideshow, eventName, detail) {
    var event = new CustomEvent(eventName, {detail: detail});
    slideshow.element.dispatchEvent(event);
  };

  function updateAriaLive(slideshow) {
    slideshow.ariaLive.innerHTML = 'Item '+(slideshow.selectedSlide + 1)+' of '+slideshow.items.length;
  };

  function externalControlSlide(slideshow, button) { // control slideshow using external element
    button.addEventListener('click', function(event){
      var index = button.getAttribute('data-index');
      if(!index || index == slideshow.selectedSlide + 1) return;
      event.preventDefault();
      showNewItem(slideshow, index - 1, false);
    });
  };

  Slideshow.defaults = {
    element : '',
    navigation : true,
    autoplay : false,
    autoplayOnHover: false,
    autoplayOnFocus: false,
    autoplayInterval: 5000,
    navigationItemClass: 'slideshow__nav-item',
    navigationClass: 'slideshow__navigation',
    swipe: false
  };

  window.Slideshow = Slideshow;

  //initialize the Slideshow objects
  var slideshows = document.getElementsByClassName('js-slideshow');
  if( slideshows.length > 0 ) {
    for( var i = 0; i < slideshows.length; i++) {
      (function(i){
        var navigation = (slideshows[i].getAttribute('data-navigation') && slideshows[i].getAttribute('data-navigation') == 'off') ? false : true,
          autoplay = (slideshows[i].getAttribute('data-autoplay') && slideshows[i].getAttribute('data-autoplay') == 'on') ? true : false,
          autoplayOnHover = (slideshows[i].getAttribute('data-autoplay-hover') && slideshows[i].getAttribute('data-autoplay-hover') == 'on') ? true : false,
          autoplayOnFocus = (slideshows[i].getAttribute('data-autoplay-focus') && slideshows[i].getAttribute('data-autoplay-focus') == 'on') ? true : false,
          autoplayInterval = (slideshows[i].getAttribute('data-autoplay-interval')) ? slideshows[i].getAttribute('data-autoplay-interval') : 5000,
          swipe = (slideshows[i].getAttribute('data-swipe') && slideshows[i].getAttribute('data-swipe') == 'on') ? true : false,
          navigationItemClass = slideshows[i].getAttribute('data-navigation-item-class') ? slideshows[i].getAttribute('data-navigation-item-class') : 'slideshow__nav-item',
          navigationClass = slideshows[i].getAttribute('data-navigation-class') ? slideshows[i].getAttribute('data-navigation-class') : 'slideshow__navigation';
        new Slideshow({element: slideshows[i], navigation: navigation, autoplay : autoplay, autoplayOnHover: autoplayOnHover, autoplayOnFocus: autoplayOnFocus, autoplayInterval : autoplayInterval, swipe : swipe, navigationItemClass: navigationItemClass, navigationClass: navigationClass});
      })(i);
    }
  }
}());

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

// File#: _3_main-header-v2
// Usage: codyhouse.co/license
(function() {

  function initElementEvents(list, element, bool) {
    element.addEventListener('focus', function(){
      bool = true;
      showDropdown(list);
    });
    element.addEventListener('focusout', function(event){
      bool = false;
      hideDropdown(list, event);
    });
  };

  function showDropdown(list) {
    if(list.hideInterval) clearInterval(list.hideInterval);
    Util.addClass(list.dropdown, 'header-v2__nav-list--is-visible');
    resetDropdownStyle(list.dropdown, true);
  };

  function hideDropdown(list, event) {
    if(list.hideInterval) clearInterval(this.hideInterval);
    list.hideInterval = setTimeout(function(){
      var submenuFocus = document.activeElement.closest('.header-v2__nav-item--main'),
        inFocus = submenuFocus && (submenuFocus == list.element);
      if(!list.triggerFocus && !list.dropdownFocus && !inFocus) { // hide if focus is outside submenu
        Util.removeClass(list.dropdown, 'header-v2__nav-list--is-visible');
        resetDropdownStyle(list.dropdown, false);
        hideSubLevels(list);
        list.prevFocus = false;
      }
    }, 100);
  };

  function initNestedDropdown(list) {
    var dropdownMenu = list.element.getElementsByClassName('header-v2__nav-list');
    for(var i = 0; i < dropdownMenu.length; i++) {
      var listItems = dropdownMenu[i].children;
      // bind hover
      new menuAim({
        menu: dropdownMenu[i],
        activate: function(row) {
        	var subList = row.getElementsByClassName('header-v2__nav-dropdown')[0];
        	if(!subList) return;
        	Util.addClass(row.querySelector('a.header-v2__nav-link'), 'header-v2__nav-link--hover');
        	showLevel(list, subList);
        },
        deactivate: function(row) {
        	var subList = row.getElementsByClassName('header-v2__nav-dropdown')[0];
        	if(!subList) return;
        	Util.removeClass(row.querySelector('a.header-v2__nav-link'), 'header-v2__nav-link--hover');
        	hideLevel(list, subList);
        },
        exitMenu: function() {
          return true;
        },
        submenuSelector: '.header-v2__nav-item--has-children',
      });
    }
    // store focus element before change in focus
    list.element.addEventListener('keydown', function(event) {
      if( event.keyCode && event.keyCode == 9 || event.key && event.key == 'Tab' ) {
        list.prevFocus = document.activeElement;
      }
    });
    // make sure that sublevel are visible when their items are in focus
    list.element.addEventListener('keyup', function(event) {
      if( event.keyCode && event.keyCode == 9 || event.key && event.key == 'Tab' ) {
        // focus has been moved -> make sure the proper classes are added to subnavigation
        var focusElement = document.activeElement,
          focusElementParent = focusElement.closest('.header-v2__nav-dropdown'),
          focusElementSibling = focusElement.nextElementSibling;

        // if item in focus is inside submenu -> make sure it is visible
        if(focusElementParent && !Util.hasClass(focusElementParent, 'header-v2__nav-list--is-visible')) {
          showLevel(list, focusElementParent);
        }
        // if item in focus triggers a submenu -> make sure it is visible
        if(focusElementSibling && !Util.hasClass(focusElementSibling, 'header-v2__nav-list--is-visible')) {
          showLevel(list, focusElementSibling);
        }

        // check previous element in focus -> hide sublevel if required
        if( !list.prevFocus) return;
        var prevFocusElementParent = list.prevFocus.closest('.header-v2__nav-dropdown'),
          prevFocusElementSibling = list.prevFocus.nextElementSibling;

        if( !prevFocusElementParent ) return;

        // element in focus and element prev in focus are siblings
        if( focusElementParent && focusElementParent == prevFocusElementParent) {
          if(prevFocusElementSibling) hideLevel(list, prevFocusElementSibling);
          return;
        }

        // element in focus is inside submenu triggered by element prev in focus
        if( prevFocusElementSibling && focusElementParent && focusElementParent == prevFocusElementSibling) return;

        // shift tab -> element in focus triggers the submenu of the element prev in focus
        if( focusElementSibling && prevFocusElementParent && focusElementSibling == prevFocusElementParent) return;

        var focusElementParentParent = focusElementParent.parentNode.closest('.header-v2__nav-dropdown');

        // shift tab -> element in focus is inside the dropdown triggered by a siblings of the element prev in focus
        if(focusElementParentParent && focusElementParentParent == prevFocusElementParent) {
          if(prevFocusElementSibling) hideLevel(list, prevFocusElementSibling);
          return;
        }

        if(prevFocusElementParent && Util.hasClass(prevFocusElementParent, 'header-v2__nav-list--is-visible')) {
          hideLevel(list, prevFocusElementParent);
        }
      }
    });
  };

  function hideSubLevels(list) {
    var visibleSubLevels = list.dropdown.getElementsByClassName('header-v2__nav-list--is-visible');
    if(visibleSubLevels.length == 0) return;
    while (visibleSubLevels[0]) {
      hideLevel(list, visibleSubLevels[0]);
   	}
   	var hoveredItems = list.dropdown.getElementsByClassName('header-v2__nav-link--hover');
   	while (hoveredItems[0]) {
      Util.removeClass(hoveredItems[0], 'header-v2__nav-link--hover');
   	}
  };

  function showLevel(list, level, bool) {
    if(bool == undefined) {
      //check if the sublevel needs to be open to the left
      Util.removeClass(level, 'header-v2__nav-dropdown--nested-left');
      var boundingRect = level.getBoundingClientRect();
      if(window.innerWidth - boundingRect.right < 5 && boundingRect.left + window.scrollX > 2*boundingRect.width) Util.addClass(level, 'header-v2__nav-dropdown--nested-left');
    }
    Util.addClass(level, 'header-v2__nav-list--is-visible');
  };

  function hideLevel(list, level) {
    if(!Util.hasClass(level, 'header-v2__nav-list--is-visible')) return;
    Util.removeClass(level, 'header-v2__nav-list--is-visible');

    level.addEventListener('transition', function cb(){
      level.removeEventListener('transition', cb);
      Util.removeClass(level, 'header-v2__nav-dropdown--nested-left');
    });
  };

  var mainHeader = document.getElementsByClassName('js-header-v2');
  if(mainHeader.length > 0) {
    var menuTrigger = mainHeader[0].getElementsByClassName('js-anim-menu-btn')[0],
      firstFocusableElement = getMenuFirstFocusable();

    // we'll use these to store the node that needs to receive focus when the mobile menu is closed
    var focusMenu = false;

    menuTrigger.addEventListener('anim-menu-btn-clicked', function(event){ // toggle menu visibility an small devices
      Util.toggleClass(document.getElementsByClassName('header-v2__nav')[0], 'header-v2__nav--is-visible', event.detail);
      Util.toggleClass(mainHeader[0], 'header-v2--expanded', event.detail);
      menuTrigger.setAttribute('aria-expanded', event.detail);
      if(event.detail) firstFocusableElement.focus(); // move focus to first focusable element
      else if(focusMenu) {
        focusMenu.focus();
        focusMenu = false;
      }
    });

    // take care of submenu
    var mainList = mainHeader[0].getElementsByClassName('header-v2__nav-list--main');
    if(mainList.length > 100) {
      for( var i = 0; i < mainList.length; i++) {
        (function(i){
          new menuAim({ // use diagonal movement detection for main submenu
            menu: mainList[i],
            activate: function(row) {
            	var submenu = row.getElementsByClassName('header-v2__nav-dropdown');
            	if(submenu.length == 0 ) return;
            	Util.addClass(submenu[0], 'header-v2__nav-list--is-visible');
            	resetDropdownStyle(submenu[0], true);
            },
            deactivate: function(row) {
            	var submenu = row.getElementsByClassName('header-v2__nav-dropdown');
            	if(submenu.length == 0 ) return;
            	Util.removeClass(submenu[0], 'header-v2__nav-list--is-visible');
            	resetDropdownStyle(submenu[0], false);
            },
            exitMenu: function() {
              return true;
            },
            submenuSelector: '.header-v2__nav-item--has-children',
            submenuDirection: 'below'
          });

          // take care of focus event for main submenu
          var subMenu = mainList[i].getElementsByClassName('header-v2__nav-item--main');
          for(var j = 0; j < subMenu.length; j++) {(function(j){if(Util.hasClass(subMenu[j], 'header-v2__nav-item--has-children')) new Submenu(subMenu[j]);})(j);};
        })(i);
      }
    }

    // if data-animation-offset is set -> check scrolling
    var animateHeader = mainHeader[0].getAttribute('data-animation');
    if(animateHeader && animateHeader == 'on') {
      var scrolling = false,
        scrollOffset = (mainHeader[0].getAttribute('data-animation-offset')) ? parseInt(mainHeader[0].getAttribute('data-animation-offset')) : 400,
        mainHeaderHeight = mainHeader[0].offsetHeight,
        mainHeaderWrapper = mainHeader[0].getElementsByClassName('header-v2__wrapper')[0];

      window.addEventListener("scroll", function(event) {
        if( !scrolling ) {
          scrolling = true;
          (!window.requestAnimationFrame) ? setTimeout(function(){checkMainHeader();}, 250) : window.requestAnimationFrame(checkMainHeader);
        }
      });

      function checkMainHeader() {
        var windowTop = window.scrollY || document.documentElement.scrollTop;
        Util.toggleClass(mainHeaderWrapper, 'header-v2__wrapper--is-fixed', windowTop >= mainHeaderHeight);
        Util.toggleClass(mainHeaderWrapper, 'header-v2__wrapper--slides-down', windowTop >= scrollOffset);
        scrolling = false;
      };
    }

    // listen for key events
    window.addEventListener('keyup', function(event){
      // listen for esc key
      if( (event.keyCode && event.keyCode == 27) || (event.key && event.key.toLowerCase() == 'escape' )) {
        // close navigation on mobile if open
        if(menuTrigger.getAttribute('aria-expanded') == 'true' && isVisible(menuTrigger)) {
          focusMenu = menuTrigger; // move focus to menu trigger when menu is close
          menuTrigger.click();
        }
      }
      // listen for tab key
      if( (event.keyCode && event.keyCode == 9) || (event.key && event.key.toLowerCase() == 'tab' )) {
        // close navigation on mobile if open when nav loses focus
        if(menuTrigger.getAttribute('aria-expanded') == 'true' && isVisible(menuTrigger) && !document.activeElement.closest('.js-header-v2')) menuTrigger.click();
      }
    });

    // listen for resize
    var resizingId = false;
    window.addEventListener('resize', function() {
      clearTimeout(resizingId);
      resizingId = setTimeout(doneResizing, 500);
    });

    function doneResizing() {
      if( !isVisible(menuTrigger) && Util.hasClass(mainHeader[0], 'header-v2--expanded')) menuTrigger.click();
    };

    function getMenuFirstFocusable() {
      var focusableEle = mainHeader[0].getElementsByClassName('header-v2__nav')[0].querySelectorAll('[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary'),
        firstFocusable = false;
      for(var i = 0; i < focusableEle.length; i++) {
        if( focusableEle[i].offsetWidth || focusableEle[i].offsetHeight || focusableEle[i].getClientRects().length ) {
          firstFocusable = focusableEle[i];
          break;
        }
      }

      return firstFocusable;
    };
  }

  function resetDropdownStyle(dropdown, bool) {
    if(!bool) {
      dropdown.addEventListener('transitionend', function cb(){
        dropdown.removeAttribute('style');
        dropdown.removeEventListener('transitionend', cb);
      });
    } else {
      var boundingRect = dropdown.getBoundingClientRect();
      if(window.innerWidth - boundingRect.right < 5 && boundingRect.left + window.scrollX > 2*boundingRect.width) {
        var left = parseFloat(window.getComputedStyle(dropdown).getPropertyValue('left'));
        dropdown.style.left = (left + window.innerWidth - boundingRect.right - 5) + 'px';
      }
    }
  };

  function isVisible(element) {
    return (element.offsetWidth || element.offsetHeight || element.getClientRects().length);
  };
}());
