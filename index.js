'use strict';
/*jshint browser: true */

module.exports = function () {
  var require_ = this;
  return function (request, stubs) { 
    console.log('boom', request, stubs); 
    return require_(request);
  };
};
