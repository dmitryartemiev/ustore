"use strict";

// -----SLIDER-----

let position = 0;
let sliderTrack = document.getElementsByClassName("slider__track")[0];
let btnPrev = document.getElementsByClassName("prev")[0];
let btnNext = document.getElementsByClassName("next")[0];
let contentCount = sliderTrack.children.length;
let sliderContainer = document.getElementsByClassName("slider__container")[0];

function nextSlide() {
  let sliderContainerWidth = sliderContainer.clientWidth;
  if (position === contentCount - 1) {
    position = 0;
    sliderTrack.style.transform =
      "translateX(-" + sliderContainerWidth * position + "px)";
  } else {
    position++;
    sliderTrack.style.transform =
      "translateX(-" + sliderContainerWidth * position + "px)";
  }
}

function prevSlide() {
  let sliderContainerWidth = sliderContainer.clientWidth;

  if (position === 0) {
    position = contentCount - 1;
    sliderTrack.style.transform =
      "translateX(-" + sliderContainerWidth * position + "px)";
  } else {
    position--;
    sliderTrack.style.transform =
      "translateX(-" + sliderContainerWidth * position + "px)";
  }
}

let timer = setInterval(function () {
  nextSlide();
}, 5000);

sliderContainer.onmouseout = function () {
  timer = setInterval(function () {
    nextSlide();
  }, 5000);
};
sliderContainer.onmouseover = function () {
  clearInterval(timer);
};

// -----END OF SLIDER-----