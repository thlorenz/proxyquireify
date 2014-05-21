'use strict';

var fs = require('fs');
var path = require('path');

var preludePath = path.join(__dirname, 'prelude.js');
var prelude = fs.readFileSync(preludePath, 'utf8');

// This plugin replaces the prelude and adds a transform
var plugin = exports.plugin = function (bfy, opts) {
  var oldBrowserPack = bfy._browserPack;

  bfy._browserPack = function (params) {
    params.preludePath = preludePath;
    params.prelude = prelude;
    return oldBrowserPack(params);
  }

  bfy.transform(require('./transform'));
};

// Maintain support for the old interface
exports.browserify = function (files) {
  console.error('You are setting up proxyquireify via the old API which will be deprecated in future versions.');
  console.error('It is recommended to use it as a browserify-plugin instead - see the example in the README.');
  return require('browserify')(files).plugin(plugin);
};
