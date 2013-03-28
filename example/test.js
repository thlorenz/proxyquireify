'use strict';
var proxyquire = require('../index')(require);

var stubs = { 
  './bar': { 
      wunder: function () { return 'really, really wunderbar'; }
    , kinder: function () { return 'schokolade'; }
  }
};

require('./src/foo');
var foo = proxyquire('./src/foo', stubs);
console.log(foo());
