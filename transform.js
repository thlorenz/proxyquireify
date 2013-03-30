'use strict';

var through = require('through')
  , excludes = {}
  , prelude = 
      '/*proxyquireify override */;var require_ = require;'
    + 'var require = require(\'proxyquireify\').proxy(require_);\n'
    ;

module.exports = function (file) {
  if (file === require.resolve('./index')) return through();
  var data = '';

  return through(write, end);
    
  function write (buf) { data += buf; }
  function end() {
    this.queue(prelude);
    this.queue(data);
    this.queue(null);
  }
};
