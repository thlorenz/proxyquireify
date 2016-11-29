// comments are ok before 'use strict'
'use strict'

var proxyquire = require('proxyquireify')(require)
var barber = {
  bar: function () { return 'barber' }
}

function proxy () {
  // missing var declaration throws in strict-mode, otherwise not
  foober =  proxyquire('../fixtures/foo', { './bar': barber })
  return foober
}

test('\nstrict mode compliant', function (t) {
  t.throws(proxy, new ReferenceError('foober is not defined'), 'strict mode is active')
  t.end()
})
