/* Copyright (c) 2017 Andrea Buran [www.andreaburan.com]. All rights reserved */

/*
** Broken line
*/

// Retrieve HTML elements
const stalactite = document.querySelector('.base-stalactite');
const stalagmite = document.querySelector('.base-stalagmite');

console.log(stalactite);
console.log(stalagmite);

// Constants for SVG setup
const pathHeight = 8,  // SVG height
      pathWidth = 1024,  // SVG width
      space = ' ',
      path1stPoint = 'M0,0' + space,
      path2ndPoint = 'L1024,0' + space,
      pathLastPoint = 'Z';

// Generate a random integer between a min and a max
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Generate an array of (more or less) randomized points
function generatePoints(count, deltaX, minY, maxY) {
  let inputPoints = [],
      outputPoints = [];

  for (var i = count; i >= 0; i--) {
    inputPoints.push(0 + Math.round((pathWidth / count * i)));
  }

  inputPoints.forEach(function (point, i) {
    if ((i === 0) || (i === inputPoints.length - 1)) {
      outputPoints.push(inputPoints[i].toString() + ',' + getRandomInt(minY, maxY).toString());
    } else {
      outputPoints.push(getRandomInt(inputPoints[i] - deltaX, inputPoints[i] + deltaX).toString() + ',' + getRandomInt(minY, maxY).toString());
    }
  });

  return outputPoints;
}

// Combine points into a path string
function combinePoints(generation) {
  let points = generation;

  let path = path1stPoint;
  path += path2ndPoint;

  points.forEach(function (point, i) {
    path += 'L' + points[i] + space;
  });

  path += pathLastPoint;

  return path;
}

// Create an SVG element
function createSVG(edgeStart, edgeEnd, className) {
  let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', className);
  svg.setAttribute('fill', 'none');
  svg.setAttribute('width', pathWidth);
  svg.setAttribute('height', pathHeight);
  svg.setAttribute('preserveAspectRatio', 'none');
  svg.setAttribute('viewBox', '0 0 1024 8');
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

  let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  svg.appendChild(path);
  path.setAttribute('d', edgeStart);

  let animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
  path.appendChild(animate);
  animate.setAttribute('attributeName', 'd');
  animate.setAttribute('dur', '100ms');
  animate.setAttribute('fill', 'freeze');
  animate.setAttribute('from', edgeStart);
  animate.setAttribute('repeatCount', '1');
  animate.setAttribute('to', edgeEnd);

  return svg;
}

// Remove previously prepended SVGs
function clearSVGs() {
  if (document.body.contains(document.getElementsByClassName('stalactite')[0])) {
    document.getElementsByClassName('stalactite')[0].remove();
    //console.log('Stalactite cleared.');
  }
  if (document.body.contains(document.getElementsByClassName('stalagmite')[0])) {
    document.getElementsByClassName('stalagmite')[0].remove();
    //console.log('Stalagmite cleared.');
  }
}

// Prepend SVGs
function prependSVGs(pointNumber, deltaXStart, minYStart, maxYStart, deltaXEnd, minYEnd, maxYEnd) {
  // Create the stalactite random edge
  if (stalactite) {
    stalactite.prepend(
      createSVG(
        combinePoints(generatePoints(pointNumber, deltaXStart, minYStart, maxYStart)),
        combinePoints(generatePoints(pointNumber, deltaXEnd, minYEnd, maxYEnd)),
        'stalactite'
      )
    );
  }

  // Create the stalagmite random edge
  if (stalagmite) {
    stalagmite.prepend(
      createSVG(
        combinePoints(generatePoints(pointNumber, deltaXStart, minYStart, maxYStart)),
        combinePoints(generatePoints(pointNumber, deltaXEnd, minYEnd, maxYEnd)),
        'stalagmite'
      )
    );
  }
}

// Responsive behavior using matchMedia
function applySVGByScreenSize() {
  clearSVGs(); // Remove any existing SVGs first
  if (window.matchMedia('(min-width: 75em)').matches) {
    // 1200 < width | 16*75 < width
    //console.log("1200 < width");
    prependSVGs(11, 0, 0, 0, 16, 0, 8);
  } else if (window.matchMedia('(min-width: 60em) and (max-width: 75em)').matches) {
    // 960 < width < 1200 | 16*60 < width < 16*75
    //console.log("960 < width < 1200");
    prependSVGs(9, 0, 0, 0, 16, 0, 8);
  } else if (window.matchMedia('(min-width: 45em) and (max-width: 60em)').matches) {
    // 720 < width < 960 | 16*45 < width < 16*60
    //console.log("720 < width < 960");
    prependSVGs(7, 0, 0, 0, 16, 0, 8);
  } else if (window.matchMedia('(min-width: 30em) and (max-width: 45em)').matches) {
    // 480 < width < 720 | 16*30 < width < 16*45
    //console.log("480 < width < 720");
    prependSVGs(5, 0, 0, 0, 16, 0, 8);
  } else {
    // width < 480 | width < 16*30
    //console.log("width < 480");
    prependSVGs(3, 0, 0, 0, 16, 0, 8);
  }
}

// Debounce helper to limit resize event frequency
function debounce(func, wait) {
  let timeout; // Define timeout variable
  return function(...args) {
    clearTimeout(timeout); // Clear timeout if function is called again
    timeout = setTimeout(() => func(...args), wait); // Set new timeout
  };
}

// Initial application and on resize
applySVGByScreenSize(); // Run on page load
window.addEventListener('resize', debounce(applySVGByScreenSize, 100)); // Run on resize with debounce
