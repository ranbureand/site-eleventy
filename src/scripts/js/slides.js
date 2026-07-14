/* Copyright (c) 2017 Andrea Buran [www.andreaburan.com]. All rights reserved */

/*
** Slides
*/

// Query all slideshows
const slideshows = document.querySelectorAll('.slides');

const FADE_DURATION_MS = 200; // matches the 0.2s in CSS transition
const VISIBLE_DURATION_MS = 1600; // how long a slide stays fully visible
const CYCLE_TIME_MS = FADE_DURATION_MS + VISIBLE_DURATION_MS;

// Loop over each slideshow
slideshows.forEach(container => {
  const slides = Array.from(container.querySelectorAll('.slide'));

  // If there are no slides, exit early
  if (slides.length === 0) return;

  // If there is only one slide, exit optionally
  if (slides.length === 1) {
    slides[0].classList.add('current');
    return;
  }

  let currentIndex = 0;

  // Clear leftover classes/styles
  slides.forEach(slide => {
    slide.classList.remove('current', 'next');
    slide.style.opacity = '';
  });

  // Set the first slide as current
  slides[currentIndex].classList.add('current');

  // Save the interval ID to eventually clear it later
  const intervalId = setInterval(() => {
    const oldIndex = currentIndex;
    currentIndex = (currentIndex + 1) % slides.length;

    const oldSlide = slides[oldIndex];
    const newSlide = slides[currentIndex];

    // Prepare new slide
    newSlide.classList.remove('current');
    newSlide.classList.add('next');
    newSlide.style.opacity = 0;

    // Force reflow to ensure the opacity = 0 is applied before we toggle it to 1 (start of CSS transition)
    void newSlide.offsetWidth;

    // Fade in the new slide
    newSlide.style.opacity = 1;

    // When the fade-in finishes, finalize classes
    const handleTransitionEnd = (e) => {
      if (e.propertyName === 'opacity' && e.target === newSlide) {
        oldSlide.classList.remove('current');
        newSlide.classList.remove('next');
        newSlide.classList.add('current');
        newSlide.style.opacity = '';

        // Remove event listener so it does not accumulate
        newSlide.removeEventListener('transitionend', handleTransitionEnd);
      }
    };

    newSlide.addEventListener('transitionend', handleTransitionEnd);
  }, CYCLE_TIME_MS);
});