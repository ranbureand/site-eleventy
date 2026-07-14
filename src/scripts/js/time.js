/* Copyright (c) 2017 Andrea Buran [www.andreaburan.com]. All rights reserved */

/*
** Time
*/

function clock() {
  var now = new Date(),
      hours = now.getHours(),
      minutes = now.getMinutes(),
      ampm = hours >= 12 ? 'pm' : 'am';

  hours = hours % 12;
  hours = hours ? hours : 12;

  minutes = minutes < 10 ? '0' + minutes : minutes;
  var time = hours + ':' + minutes + ' ' + ampm;

  document.getElementById('time').innerHTML = time;
}

clock();

setInterval(clock, 10000);

const now = new Date();
const tz = now.getTimezoneOffset();

console.log(tz);