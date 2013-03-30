'use strict';

var through = require('through')
  , excludes = {}
  , prelude = 
      ';var require_ = require;'
    + 'var require = require(\'proxyquireify\').proxy(require_);'
    ;

[ __filename
, require.resolve('./hack-prelude')
, require.resolve('browserify')
].forEach(function (k) { excludes[k] = true; });


module.exports = function (file) {
  if (file === require.resolve('./index')) return through();
  var data = '';

  return through(write, end);
    
  function write (buf) { data += buf; }
  function end() {

    if (excludes[file]) {
      this.queue('// this file was excluded from the bundle since it is only needed during the build');
      return this.queue(null);
    }

    this.queue(prelude);
    this.queue(data);
    this.queue(null);
  }
};
