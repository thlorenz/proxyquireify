var proxyquireify = require('..');

var barStub = { wunder: function () { return 'not so wunderbar'; } };

var foo = proxyquireify('foo', { './bar': barStub });

console.log(foo());
