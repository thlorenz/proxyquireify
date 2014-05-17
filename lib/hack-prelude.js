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
  return require('browserify')(files).plugin(plugin);
};
