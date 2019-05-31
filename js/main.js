"use strict";

$(document).ready(function () {
  // header
  $(window).on("scroll", function () {
    if ($(window).scrollTop() > 10) {
      $(".header__top").addClass("header__top--fixed");
    } else {
      $(".header__top").removeClass("header__top--fixed");
    }
  }); // menu

  $(".header__nav-link").on("click", function (e) {
    e.preventDefault();
    var id = $(this).attr("href");
    var top = $(id).offset().top;
    $(".header__nav-link").removeClass("active");
    $(this).addClass("active");
    $("body, html").animate({
      scrollTop: top
    }, 1000);
  }); // mobile menu

  $(".header__burger").on("click", function () {
    $(".header__nav").addClass("header__nav--opened");
    $("body").addClass("modal-opened");
    $(".header__close, .header__nav-link").on("click", function () {
      $(".header__nav").removeClass("header__nav--opened");
      $("body").removeClass("modal-opened");
    });
  }); // scroll

  var anchors = [];
  var currentAnchor = 0;
  var isAnimating = false;

  var updateAnchors = function updateAnchors() {
    anchors = [];
    $(".anchor").each(function (i, element) {
      anchors.push($(element).offset().top);
    });
  };

  var onMousewheel = function onMousewheel(e) {
    e.preventDefault();
    e.stopPropagation();

    if (isAnimating) {
      return false;
    }

    isAnimating = true; // Increase or reset current anchor

    if (e.originalEvent.wheelDelta >= 0) {
      currentAnchor--;
    } else {
      currentAnchor++;
    }

    if (currentAnchor < 0) {
      currentAnchor = 0;
    }

    if (currentAnchor > anchors.length - 1) {
      currentAnchor = anchors.length - 1;
    }

    isAnimating = true;
    $("html, body").animate({
      scrollTop: parseInt(anchors[currentAnchor], 10)
    }, 500, "swing", function () {
      isAnimating = false;
    });

    if ($(".anchor").eq(currentAnchor).attr("id")) {
      var id = $(".anchor").eq(currentAnchor).attr("id");
      $(".header__nav-link").removeClass("active").filter("[href='#" + id + "']").addClass("active");
    } else {
      $(".header__nav-link").removeClass("active");
    }

    updateAnchors();
    return true;
  };

  $(window).on("resize load", function () {
    if ($(window).width() > 1024) {
      updateAnchors();
      $("body").on("mousewheel", onMousewheel);
    } else {
      $("body").unbind("mousewheel", onMousewheel);
    }
  }); // slider

  var slider = $(".slider");
  var slide = $(".slide");
  var next = $(".slider__controls--next");
  var prev = $(".slider__controls--prev");
  slider.each(function () {
    var _this = this;

    $(this).find(slide).each(function () {
      $(_this).find(".slider__nav").append("<li class=\"slider__dot\"></li>");
    });
  });
  var sliderDot = $(".slider__dot");

  var getCurrentSlide = function getCurrentSlide(target) {
    var firstSlide = target.closest(slider).find(".slide:first").index();
    return target.closest(slider).find(".slide.active").index() - firstSlide;
  };

  var goToSlide = function goToSlide(target, slideNumber) {
    var slides = target.closest(slider).find(slide);
    var currentSlide = (slideNumber + slides.length) % slides.length;
    slides.removeClass("active").eq(currentSlide).addClass("active");
    target.closest(slider).find(sliderDot).removeClass("active").eq(currentSlide).addClass("active");
  };

  $(".slider__nav .slider__dot:first-child").addClass("active");
  sliderDot.on("click", function (_ref) {
    var target = _ref.target;
    goToSlide($(this), $(target).index());
  });
  next.on("click", function () {
    var slideNumber = getCurrentSlide($(this)) + 1;
    goToSlide($(this), slideNumber);
  });
  prev.on("click", function () {
    var slideNumber = getCurrentSlide($(this)) - 1;
    goToSlide($(this), slideNumber);
  }); // swipe slider

  slider.swipe({
    swipeLeft: function swipeLeft() {
      $(this).find(next).trigger("click");
    },
    swipeRight: function swipeRight() {
      $(this).find(prev).trigger("click");
    },
    triggerOnTouchEnd: false
  });
});