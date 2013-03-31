var path = require("path")
  , proxy = require("proxyquireify");


var depuno = proxy("./depuno", { path: { extname: function () { return 'blah'; } } });

function foo() {
  var stubs = { './bar': { wunder: function () { return 'bar'; } } }; 
  var proxy2 = require('proxyquireify')
    , depdos = proxy2('./foo', stubs)
    , deptres = proxy('./foo', { path: { sep: '/' } })
    ;
}
