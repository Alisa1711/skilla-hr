$(document).ready(function () {
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
