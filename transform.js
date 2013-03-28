'use strict';

var through = require('through')
  , prelude = 
      ';var require_ = require;'
    + 'var require = require(\'proxyquireify\').proxy(require_);'
    ;

module.exports = function (file) {
  if (file === require.resolve('./index')) return through();
  var data = '';

  return through(write, end);
    
  function write (buf) { data += buf; }
  function end() {

    if (file === __filename) {
      this.queue('// transform was excluded from the bundle since it is only needed during the build');
      return this.queue(null);
    }

    this.queue(prelude);
    this.queue(data);
    this.queue(null);
  }
};
