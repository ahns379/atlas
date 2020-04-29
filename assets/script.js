//code inspiration from CodePen.io
var startTime = new Date(),
    // get the starting positions of each hand (in seconds)
    startS = startTime.getSeconds(),
    startM = startTime.getMinutes() * 60 + startS,
    startH = startTime.getHours() % 12 * 3600 + startM;

refreshClock();

// compute the rotation amount relative to the starting time
function refreshClock() {
  var now = new Date(),
      diff = timeDifference(startTime, now),
      degS = (startS + diff) / 60 * 360,
      degM = (startM + diff) / 3600 * 360,
      degH = (startH + diff) / 43200 * 360;

  $('.hour').css(rotate(degH));
  $('.minute').css(rotate(degM));
  $('.second').css(rotate(degS));

  setTimeout(refreshClock, 1000);
}

// compute the time difference between two date objects (in seconds)
function timeDifference(date1, date2) {
  return Math.round(Math.abs(date2.getTime() - date1.getTime()) / 1000);
}

// returns the cross-browser css rotation properties
function rotate(deg) {
  return {
    '-webkit-transform': 'rotate(' + deg + 'deg)',
    '-moz-transform': 'rotate(' + deg + 'deg)',
    '-ms-transform': 'rotate(' + deg + 'deg)',
    '-o-transform': 'rotate(' + deg + 'deg)',
    'transform': 'rotate(' + deg + 'deg)'
  };
}


var controller = new ScrollMagic.Controller();

$(function () {
  var $block_list = $('.block-list'),
      $block_item = $block_list.find('.block-list__item'),
      block_list_width = $block_list.outerWidth(),
      block_item_width = $block_item.outerWidth(),
      total_width = block_item_width * $block_item.length,
      travel_distance = total_width - block_list_width + 20;

  var scene = new ScrollMagic.Scene({
    triggerElement: "#first",
    duration: '200%',
    triggerHook: "onLeave"
  })
  .setPin('.block-list')
  .addTo(controller);

  scene.on('progress', function(e) {
    var progress = e.progress,
        move = -travel_distance * progress + "px";
    $block_list.css({
      transform: "translateX(" + move + ")"
    });
  });
});

!(function($) {

    'use strict';

    var $slider = $('.scroll-slider'),
        $slides = $('.scroll-slide'),
        $sliderWrapper = $('.scroll-wrapper'),
        $firstSlide = $slides.first();

    var settings = {},
        resizing = false,
        scrollController = null,
        scrollTween = null,
        scrollTimeline = null,
        progress = 0,
        scrollScene = null;

    function scrollSlider(options) {

        // Default
        settings = $.extend({
            slider: '.scroll-slider',
            sliderWrapper: '.scroll-wrapper',
            slides: '.scroll-slide',
            slideWidth: null,
            slideHeight: null,
        }, options);
        setDimensions();
        $(window).on( 'resize', function() {
          clearTimeout(resizing);
          resizing = setTimeout(function() {
            setDimensions();
          }, 250);
        });

    }

    function setDimensions() {

        settings.slideWidth = $firstSlide.width();
        settings.slideHeight = $firstSlide.height();

        console.log(settings.slideWidth);
        console.log(settings.slideHeight);
        settings.sliderWidth = Math.ceil((settings.slideWidth * $slides.length));
        settings.sliderHeight = $firstSlide.outerHeight(true);
        $sliderWrapper.width(settings.sliderWidth);
        setScene();
    }

    function setScene() {

      var xDist = -$slides.width() * ( $slides.length - 1 ),
          tlParams = { x: xDist, ease: Power2.easeInOut };

      if (scrollScene != null && scrollTimeline != null) {

          progress = 0;
          scrollScene.progress(progress);

          scrollTimeline = new TimelineMax();
          scrollTimeline.to( $sliderWrapper, 2, tlParams );

          scrollScene.setTween(scrollTimeline);

          scrollScene.refresh();

      } else {
          scrollController = new ScrollMagic.Controller();
          scrollTimeline = new TimelineMax();
          scrollTimeline.to( $sliderWrapper, 2, tlParams );
          scrollTimeline.progress( progress );
          scrollScene = new ScrollMagic.Scene({
              triggerElement: settings.slider,
              triggerHook: "onLeave",
              duration: settings.sliderWidth
          })
          .setPin(settings.slider)
          .setTween(scrollTimeline)
          .addTo(scrollController)
          .on('start', function (event) {
            scrollTimeline.time(0);
          });
      }

    }

  $(document).ready(function() {
    scrollSlider();
  });

})(jQuery);

$(document).ready(function() {
		  $('.nav-toggle').click(function(){
			var collapse_content_selector = $(this).attr('href');

			var toggle_switch = $(this);
			$(collapse_content_selector).toggle(function(){
			});
		  });

		});



    $(window).on("load", function() {
      var dateWidth = $(".date").width(),
        activeDate = 0,
        noDates = $(".date").length;

      function changeDate(a) {
        if (a < 0) {
          activeDate = 0;
          return;
        }

        if (a > noDates - 1) {
          activeDate = noDates - 1;
          return;
        }

        $(".date")
          .removeClass("active sibling");

        $(".date:nth-child(" + (a + 1) + ")")
          .addClass("active");

        $(".date.active")
          .prev("div")
          .addClass("sibling");

        $(".dates-wrap").css(
          "transform",
          "translateX(" + -dateWidth * a + "px)"
        );
      }

      $(".date").on('click', function(){
         var chosen = $(this).index();

        if (chosen === activeDate) {
          return;
        }

        activeDate = chosen;
        changeDate(activeDate);
      });

      $(".controls").on("click", function() {
        var direction = parseInt($(this).attr("data-direction"), 10);

        activeDate += direction;
        changeDate(activeDate);

      });
    });

    console.clear();


    function ease({
      startValue = 0,
      endValue = 1,
      durationMs = 200,
      onStep,
      onComplete = () => {},
    }) {
      const raf = window.requestAnimationFrame || (func => window.setTimeout(func, 16));

      const stepCount = durationMs / 16;
      const valueIncrement = (endValue - startValue) / stepCount;
      const sinValueIncrement = Math.PI / stepCount;
      let currentValue = startValue;
      let currentSinValue = 0;

      function step() {
        currentSinValue += sinValueIncrement;
        currentValue += valueIncrement * (Math.sin(currentSinValue) ** 2) * 2;

        if (currentSinValue < Math.PI) {
          onStep(currentValue);
          raf(step);
        } else {
          onStep(endValue);
          onComplete();
        }
      }
      raf(step);
    }

    document.querySelectorAll('.link-to-section').forEach(el => el.addEventListener('click', e => {
      const targetId = e.target.getAttribute('href');
      const targetEl = document.querySelector(targetId);
      const targetPos = targetEl.getBoundingClientRect().top + window.scrollY;

      ease({
        startValue: window.scrollY,
        endValue: targetPos,
        durationMs: 400,
        onStep: value => window.scroll(0, value),
      });
    }));

    document.querySelectorAll('.back-to-top').forEach(el => el.addEventListener('click', () => {
      ease({
        startValue: window.scrollY,
        endValue: 0,
        onStep: value => window.scroll(0, value),
        onComplete: () => {
          document.querySelector('#search').focus();
          document.location.hash = '';
        }
      });
    }));


    var btn = $('#button');

    $(window).scroll(function() {
      if ($(window).scrollTop() > 300) {
        btn.addClass('show');
      } else {
        btn.removeClass('show');
      }
    });

    btn.on('click', function(e) {
      e.preventDefault();
      $('html, body').animate({scrollTop:0}, '300');
    });




//
// $(".js-open-modal").click(function(){
//   $(".modal").addClass("visible");
// });
//
// $(".js-close-modal").click(function(){
//   $(".modal").removeClass("visible");
// });
//
// $(document).click(function(event) {
//   if (!$(event.target).closest(".modal,.js-open-modal").length) {
//     $("body").find(".modal").removeClass("visible");
//   }
// });
