

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
