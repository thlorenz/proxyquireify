'use strict';
/*jshint asi: true */

var test       =  require('tape')
  , proxyquire =  require('proxyquireify')(require)
  , stats      =  require('./fixtures/stats')
  , barber     =  { bar: function () { return 'barber'; } }
  ;

var foo    =  proxyquire('./fixtures/foo', { './bar': { } });
var foober =  proxyquire('./fixtures/foo', { './bar':barber });

require('./fixtures/foo');

test('overrides are isolated', function (t) {
  t.equal(foo.bigBar(), 'BAR', 'foo.bigBar == BAR')  
});
