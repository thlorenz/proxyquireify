'use strict';
/*jshint asi: true, browser: true */

var test       =  require('tape')
var proxyquire =  require('proxyquireify')(require)
  , stats      =  require('./fixtures/stats')
  , barber     =  { bar: function () { return 'barber'; } }
  ;

var foober =  proxyquire('./fixtures/foo', { './bar': barber });
var foo    =  proxyquire('./fixtures/foo', { './bar': { } });

require('./fixtures/foo');

console.log('foo.bigBar()', foo.bigBar())
console.log('foober.bigBar()', foober.bigBar())

test('overriding bar.bar for foober but not for foo', function (t) {
  t.equal(window.foostats.fooRequires(), 3, 'foo is required three times since one for each test and one for require detective')
  t.equal(foo.bigBar(), 'BAR', 'foo.bigBar == BAR')  
  t.equal(foober.bigBar(), 'BARBER', 'foober.bigBar == BARBER');
  t.end()
});
