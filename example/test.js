'use strict';
var proxyquire = require('../index')(require);

var stubs = { 
  './bar': { 
      wunder: function () { return 'wirklich wunderbar'; }
    , kinder: function () { return 'schokolade'; }
  }
};

var foo = proxyquire('./src/foo', stubs);

// TODO: why does this break this line is before the proxyquire call?
//       autogenerate these calls somehow (i.e. via transform?)
require('./src/foo');

console.log(foo());
