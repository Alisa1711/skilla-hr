$(document).ready(function () {

  // header
  $(window).on(`scroll`, () => {
    if ($(window).scrollTop() > 10) {
      $(`.header__top`).addClass(`header__top--fixed`);
    } else {
      $(`.header__top`).removeClass(`header__top--fixed`);
    }
  });

  // menu
  $(`.header__nav-link`).on(`click`, function (e) {
    e.preventDefault();
    const id = $(this).attr(`href`);
    const top = $(id).offset().top;
    $(`.header__nav-link`).removeClass(`active`);
    $(this).addClass(`active`);
    $(`body, html`).animate({scrollTop: top}, 1000);
  });

  // mobile menu
  $(`.header__burger`).on(`click`, () => {
    $(`.header__nav`).addClass(`header__nav--opened`);
    $(`body`).addClass(`modal-opened`);

    $(`.header__close, .header__nav-link`).on(`click`, () => {
      $(`.header__nav`).removeClass(`header__nav--opened`);
      $(`body`).removeClass(`modal-opened`);
    });
  });

  // play button
  $(`.header__play`).on(`click`, () => {
    $(`#main-video`).show(`fast`);
  });

  $(`.modal__inner`).on(`click`, () => {
    $(`#main-video`).hide(`fast`);
    $(`.modal__video`).stop();
  });

  // scroll
  let anchors = [];
  let currentAnchor = 0;
  let isAnimating = false;

  const updateAnchors = () => {
    anchors = [];
    $(`.anchor`).each(function (i, element) {
      anchors.push($(element).offset().top);
    });
  };

  const onMousewheel = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAnimating) {
      return false;
    }
    isAnimating = true;
    // Increase or reset current anchor
    if (e.originalEvent.wheelDelta >= 0) {
      currentAnchor--;
    } else {
      currentAnchor++;
    }
    if (currentAnchor < 0) {
      currentAnchor = 0;
    }
    if (currentAnchor > (anchors.length - 1)) {
      currentAnchor = anchors.length - 1;
    }
    isAnimating = true;
    $(`html, body`).animate({
      scrollTop: parseInt(anchors[currentAnchor], 10)
    }, 500, `swing`, function () {
      isAnimating = false;
    });

    if ($(`.anchor`).eq(currentAnchor).attr(`id`)) {
      const id = $(`.anchor`).eq(currentAnchor).attr(`id`);
      $(`.header__nav-link`).
        removeClass(`active`).
        filter(`[href='#` + id + `']`).addClass(`active`);
    } else {
      $(`.header__nav-link`).removeClass(`active`);
    }

    updateAnchors();
    return true;
  };

  $(window).on(`resize load`, () => {
    if ($(window).width() > 1024) {
      updateAnchors();
      $(`body`).on(`mousewheel`, onMousewheel);
    } else {
      $(`body`).unbind(`mousewheel`, onMousewheel);
    }
  });

  // slider
  const slider = $(`.slider`);
  const slide = $(`.slide`);
  const next = $(`.slider__controls--next`);
  const prev = $(`.slider__controls--prev`);

  slider.each(function () {
    $(this).find(slide).each(() => {
      $(this).
        find(`.slider__nav`).
        append(`<li class="slider__dot"></li>`);
    });
  });

  const sliderDot = $(`.slider__dot`);

  const getCurrentSlide = (target) => {
    const firstSlide = target.
      closest(slider).
      find(`.slide:first`).
      index();
    return target.
      closest(slider).
      find(`.slide.active`).
      index() - firstSlide;
  };

  const goToSlide = (target, slideNumber) => {
    const slides = target.closest(slider).find(slide);
    const currentSlide = (slideNumber + slides.length) % slides.length;

    slides.
      removeClass(`active`).
      eq(currentSlide).addClass(`active`);

    target.closest(slider).find(sliderDot).
      removeClass(`active`).
      eq(currentSlide).addClass(`active`);
  };

  $(`.slider__nav .slider__dot:first-child`).addClass(`active`);

  sliderDot.on(`click`, function ({target}) {
    goToSlide($(this), $(target).index());
  });
  next.on(`click`, function () {
    const slideNumber = getCurrentSlide($(this)) + 1;
    goToSlide($(this), slideNumber);
  });
  prev.on(`click`, function () {
    const slideNumber = getCurrentSlide($(this)) - 1;
    goToSlide($(this), slideNumber);
  });

  // swipe slider
  slider.swipe({
    swipeLeft() {
      $(this).find(next).trigger(`click`);
    },
    swipeRight() {
      $(this).find(prev).trigger(`click`);
    },
    triggerOnTouchEnd: false
  });
});
