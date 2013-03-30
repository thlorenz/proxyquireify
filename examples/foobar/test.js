'use strict';
// make browerify include foo
require('./src/foo');

var proxyquire = require('proxyquireify')(require);

var stubs = { 
  './bar': { 
      wunder: function () { return 'wirklich wunderbar'; }
    , kinder: function () { return 'schokolade'; }
  }
};

var foo = proxyquire('./src/foo', stubs);
console.log(foo());
