'use strict';

var bpack = require('browser-pack');
var fs = require('fs');
var path = require('path');
var xtend = require('xtend');

var preludePath = path.join(__dirname, 'prelude.js');
var prelude = fs.readFileSync(preludePath, 'utf8');

// This plugin replaces the prelude and adds a transform
var plugin = exports.plugin = function (bfy, opts) {
  var replacePrelude = function() {
    var packOpts = {
      raw: true, // Added in regular Browserifiy as well
      preludePath: preludePath,
      prelude: prelude
    };

    var packer = bpack(xtend(bfy._options, packOpts));
    // Replace the 'pack' step with the new browser-pack instance
    bfy.pipeline.splice('pack', 1, packer);
  }
  bfy.transform(require('./transform'));
  bfy.on('reset', replacePrelude);
  replacePrelude();
};

// Maintain support for the old interface
exports.browserify = function (files) {
  console.error('You are setting up proxyquireify via the old API which will be deprecated in future versions.');
  console.error('It is recommended to use it as a browserify-plugin instead - see the example in the README.');
  return require('browserify')(files).plugin(plugin);
};
