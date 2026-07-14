/* Copyright (c) 2017 Andrea Buran [www.andreaburan.com]. All rights reserved */

/*
** Slides
*/

// Query all slideshows
const slideshows = document.querySelectorAll('.slides');

const FADE_DURATION_MS = 200; // matches the 0.2s in CSS transition
const VISIBLE_DURATION_MS = 1600; // how long a slide stays fully visible
const CYCLE_TIME_MS = FADE_DURATION_MS + VISIBLE_DURATION_MS;

// Whether the visitor asked for reduced motion (checked once, at load)
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Loop over each slideshow
slideshows.forEach(container => {
  const slides = Array.from(container.querySelectorAll('.slide'));

  // If there are no slides, exit early
  if (slides.length === 0) return;

  // If there is only one slide, or the visitor prefers reduced motion, just
  // show the first slide and skip the animation
  if (slides.length === 1 || prefersReducedMotion) {
    slides[0].classList.add('current');
    return;
  }

  let currentIndex = 0;

  // Hold the running interval so it can be paused later (null when stopped)
  let intervalId = null;

  // Track whether the slideshow is on screen (kept up to date by the observer below)
  let isInViewport = false;

  // Clear leftover classes/styles
  slides.forEach(slide => {
    slide.classList.remove('current', 'next');
    slide.style.opacity = '';
  });

  // Set the first slide as current
  slides[currentIndex].classList.add('current');

  // Advance to the next slide with a cross-fade
  const advance = () => {
    const oldIndex = currentIndex;
    currentIndex = (currentIndex + 1) % slides.length;

    const oldSlide = slides[oldIndex];
    const newSlide = slides[currentIndex];

    // Prepare new slide
    newSlide.classList.remove('current');
    newSlide.classList.add('next');
    newSlide.style.opacity = '0';

    // Force reflow to ensure the opacity = 0 is applied before we toggle it to 1 (start of CSS transition)
    void newSlide.offsetWidth;

    // Fade in the new slide
    newSlide.style.opacity = '1';

    // Finalize the swap exactly once, whichever trigger fires first
    let finalized = false;
    let fallbackId;

    // Promote the new slide to current, reset the old one, and clean up
    const finalize = () => {
      if (finalized) return;
      finalized = true;

      oldSlide.classList.remove('current');
      newSlide.classList.remove('next');
      newSlide.classList.add('current');
      newSlide.style.opacity = '';

      newSlide.removeEventListener('transitionend', handleTransitionEnd);
      clearTimeout(fallbackId);
    };

    // When the fade-in finishes, finalize classes
    const handleTransitionEnd = (e) => {
      if (e.propertyName === 'opacity' && e.target === newSlide) finalize();
    };

    newSlide.addEventListener('transitionend', handleTransitionEnd);

    // Fallback in case transitionend never fires (e.g. in a backgrounded tab)
    fallbackId = setTimeout(finalize, FADE_DURATION_MS + 50);
  };

  // Start cycling, but only while the slideshow is on screen and the tab is visible
  const start = () => {
    if (intervalId || !isInViewport || document.hidden) return;
    intervalId = setInterval(advance, CYCLE_TIME_MS);
  };

  // Stop cycling and release the interval
  const stop = () => {
    if (!intervalId) return;
    clearInterval(intervalId);
    intervalId = null;
  };

  // Pause when the slideshow scrolls out of view, resume when it comes back
  const observer = new IntersectionObserver(entries => {
    isInViewport = entries[0].isIntersecting;
    isInViewport ? start() : stop();
  });
  observer.observe(container);

  // Pause when the tab is hidden, resume when it is shown again
  document.addEventListener('visibilitychange', () => {
    document.hidden ? stop() : start();
  });
});
