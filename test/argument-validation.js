'use strict';
/*jshint asi: true, browser: true */

var test       =  require('tape')
  , proxyquire =  require('proxyquireify')(require)
  , bar = { bar: function () { return 'bar'; } }

test('\nillegal parameters give meaningful errors', function (t) {
  function throws(action, regex, desc) {
    t.throws(
        action
      , function (err) {
        return err.name === 'ProxyquireifyError' && regex.test(err.message);
      }
      , desc
    )
  }

  throws(
      proxyquire.bind(null, null, {})
    , /missing argument: "request"/i
    , 'throws for missing request'
  )
  throws(
      proxyquire.bind(null, {}, bar)
    , /invalid argument: "request".+needs to be a requirable string/i
    , 'throws when request is not a string'
  )
  throws(
      proxyquire.bind(null, './samples/foo')
    , /missing argument: "stubs".+use regular require instead/i
    , 'throws when no stubs are provided'
  )
  throws(
      proxyquire.bind(null, './samples/foo', 'stubs')
    , /invalid argument: "stubs".+needs to be an object/i
    , 'throws when a string is passed for stubs'
  )
  t.end()
})
