/* Copyright (c) 2017 Andrea Buran [www.andreaburan.com]. All rights reserved */

/*
** Anchored headings
*/

// Declare variables
var   article,
      headings;

// Get the .article-body element
article = document.querySelector(".article-body");

// Initialize the headings variable
if (article !== null) {
  headings = article.querySelectorAll("h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]");

  for (var i = 0; i < headings.length; i++) {
    headings[i].innerHTML =
      '<a href="#' + headings[i].id + '">' +
          //headings[i].innerText +
          headings[i].innerHTML +
      '</a>';

    console.log('Anchored heading ' + headings[i].innerText + ' created.');
  }
} else {
  headings = null;

  console.log('No headings created.')
}