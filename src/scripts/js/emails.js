/* Copyright (c) 2017 Andrea Buran [www.andreaburan.com]. All rights reserved */

/*
** Emails
*/

// Declare and assign the email address variable
const eMail = ('hello' + '@' + 'andreaburan.com');

//console.log(eAddress);

// Declare the email link variable
var   eLink;

//console.log(eLink);

// Get the .envelope elements
const eEnvelope = document.getElementsByClassName('envelope');

// Assign the email link variable and inject it in the HTML DOM
for (i = 0; i < eEnvelope.length; i++) {
  eLink = document.createElement('a');
  eLink.setAttribute('href', 'mailto:' + eMail);
  eLink.textContent = eMail;
  eEnvelope[i].prepend(eLink);

  console.log('Email created.');
}
