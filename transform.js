'use strict';

var through = require('through');

module.exports = function (file) {
  if (file === require.resolve('./index')) return through();
  var data = '';

  return through(write, end);
    
  function write (buf) { data += buf; }
  function end() {
    this.queue(';var orig_require=require;var require=orig_require(\'proxyquireify\').bind(orig_require);\n');
    this.queue(data);
    this.queue(null);
  }
};
