/* Copyright (c) 2017 Andrea Buran [www.andreaburan.com]. All rights reserved */

/*
** Slides
*/

// Wrapped in an IIFE so its top-level names stay out of the shared global scope created when the scripts are concatenated into main.min.js
(() => {
  // Query all slideshows
  const slideshows = document.querySelectorAll('.slides');

  const FADE_MS = 200; // cross-fade duration
  const VISIBLE_MS = 1600; // how long a slide stays fully visible
  const CYCLE_MS = FADE_MS + VISIBLE_MS; // time between advances

  // Whether the visitor asked for reduced motion (checked once, at load)
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Loop over each slideshow
  slideshows.forEach(container => {
    const slides = Array.from(container.querySelectorAll('.slide'));

    // If there are no slides, exit early
    if (slides.length === 0) return;

    // With a single slide, or when the visitor prefers reduced motion, just show the first slide and skip the animation
    if (slides.length === 1 || prefersReducedMotion) {
      slides[0].classList.add('current');
      return;
    }

    let currentIndex = 0;

    // Hold the running interval so it can be paused later (null when stopped)
    let intervalId = null;

    // Track whether the slideshow is on screen (kept up to date by the observer below)
    let isInViewport = false;

    // Start from a known state: only the first slide is current
    slides.forEach(slide => slide.classList.remove('current', 'incoming'));
    slides[currentIndex].classList.add('current');

    // Cross-fade to the next slide using the Web Animations API
    const advance = () => {
      const oldSlide = slides[currentIndex];
      currentIndex = (currentIndex + 1) % slides.length;
      const newSlide = slides[currentIndex];

      // Stack the incoming slide on top and let it rest at full opacity
      newSlide.classList.add('current', 'incoming');

      // Fade it in; the promise resolves only when the animation truly finishes
      newSlide
        .animate([{ opacity: 0 }, { opacity: 1 }], { duration: FADE_MS, easing: 'ease-in-out' })
        .finished.then(() => {
          // The new slide now fully covers the old one, so hide and unstack safely
          oldSlide.classList.remove('current');
          newSlide.classList.remove('incoming');
        })
        .catch(() => {}); // ignore a cancelled animation
    };

    // Start cycling, but only while the slideshow is on screen and the tab is visible
    const start = () => {
      if (intervalId || !isInViewport || document.hidden) return;
      intervalId = setInterval(advance, CYCLE_MS);
    };

    // Stop cycling and release the interval
    const stop = () => {
      if (!intervalId) return;
      clearInterval(intervalId);
      intervalId = null;
    };

    // Pause when the slideshow scrolls out of view, resume when it comes back
    new IntersectionObserver(entries => {
      isInViewport = entries[0].isIntersecting;
      isInViewport ? start() : stop();
    }).observe(container);

    // Pause when the tab is hidden, resume when it is shown again
    document.addEventListener('visibilitychange', () => {
      document.hidden ? stop() : start();
    });
  });
})();
