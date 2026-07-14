/* Copyright (c) 2017 Andrea Buran [www.andreaburan.com]. All rights reserved */

/*
** Sticky header
*/

// Get the .canvas-header and .header elements
const canvasHeader = document.querySelector(".canvas-header"),
      header = document.querySelector(".header");

// Get the offset position of the .header element
var   offset = header.offsetTop;

// When you reach the position of the .header element, add the class .sticky to the .canvas-header element
// When you unreach the position of the .header element, remove the class .sticky from the .canvas-header element
function stickify() {
  if ( window.pageYOffset > offset ) {
    canvasHeader.classList.add('sticky');
  } else {
    canvasHeader.classList.remove('sticky');
  }
}

stickify();

// When the window is scrolled, execute the function stickify()
window.onscroll = function() {
  stickify();
};

// When the window is resized, get again the offset position of the .header element and execute the function stickify()
window.onresize = function() {
  canvasHeader.classList.remove('sticky');
  offset = header.offsetTop;

  stickify();
};