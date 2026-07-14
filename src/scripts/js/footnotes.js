/* Copyright (c) 2017 Andrea Buran [www.andreaburan.com]. All rights reserved */

/*
** Footnotes
*/

// Get the .reversefootnote elements
var footnote = document.getElementsByClassName('reversefootnote');

//console.log(footnote);

// Change the default copy of the footnote links
for (i = 0; i < footnote.length; i++) {
  footnote[i].textContent = 'Go\xa0back\xa0⬏';
}