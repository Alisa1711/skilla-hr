$(document).ready(function () {
  const sliders = $(`.slider__content`);

  sliders.each(function () {
    $(this).find(`.slide`).each(() => {
      $(this).
        find(`.slider__nav`).
        append(`<li class="slider__dot"></li>`);
    });
  });

  const getCurrentSlide = (target) => {
    const firstSlide = target.
      closest(`.slider__content`).
      find(`.slide:first`).
      index();
    return target.
      closest(`.slider__content`).
      children(`.slide.active`).
      index() - firstSlide;
  };

  const goToSlide = (target, slideNumber) => {
    const slider = target.closest(`.slider__content`);
    const slides = slider.find(`.slide`);
    const dots = slider.find(`.slider__dot`);
    const currentSlide = (slideNumber + slides.length) % slides.length;

    slides.removeClass(`active`).eq(currentSlide).addClass(`active`);
    dots.removeClass(`active`).eq(currentSlide).addClass(`active`);
  };

  $(`.slider__nav .slider__dot:first-child`).addClass(`active`);

  $(`.slider__dot`).on(`click`, function ({target}) {
    goToSlide($(this), $(target).index());
  });
  $(`.slider__controls--next`).on(`click`, function () {
    const slideNumber = getCurrentSlide($(this)) + 1;
    goToSlide($(this), slideNumber);
  });
  $(`.slider__controls--prev`).on(`click`, function () {
    const slideNumber = getCurrentSlide($(this)) - 1;
    goToSlide($(this), slideNumber);
  });
});
