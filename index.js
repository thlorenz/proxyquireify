'use strict';
/*jshint browser: true */

module.exports = function (request, require) {
  console.log('requireing request');
  return require(request);
};
