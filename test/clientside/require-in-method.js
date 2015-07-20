'use strict';
/*jshint asi: true, browser: true */

var proxyquire =  require('proxyquireify')(require)
  , barber     =  { bar: function () { return 'barber'; } }
  ;

test('\noverriding dep with stub when original require is done inside a method', function (t) {

  var foober = proxyquire('../fixtures/require-in-method', { './bar': barber }).create();
  t.equal(foober.bar(), 'barber', 'returns the modified value')

  t.end()
})
