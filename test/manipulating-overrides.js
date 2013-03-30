'use strict';
/*jshint asi: true, browser: true */

var test       =  require('tape')
var proxyquire =  require('proxyquireify')(require)
  , stats      =  require('./fixtures/stats')
  , barber     =  { bar: function () { return 'barber'; } }
  ;

var foober =  proxyquire('./fixtures/foo', { './bar': barber });

require('./fixtures/foo');

test('overriding dep with stub and manipulating stub afterwards', function (t) {

  barber.bar = function () { return 'friseur'; }
  barber.rab = function () { return 'rabarber'; }

  t.equal(foober.bigBar(), 'FRISEUR', 'overrides previously stubbed func');
  t.equal(foober.bigRab(), 'RABARBER', 'overrides func not previously stubbed');
  t.end()
})
