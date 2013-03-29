'use strict';
/*jshint asi: true */

var browserify =  require('browserify');
var vm         =  require('vm');
var proxyquire =  require('..');

browserify()
  .require(require.resolve('..'), { expose: 'proxyquireify' })
  .add(require.resolve('./proxyquireify'))
  .transform(proxyquire.transform)
  .bundle(function (err, src) {
    if (err) return console.error(err);
    var res = vm.runInNewContext(src, { setTimeout: setTimeout, console: console } );
});

