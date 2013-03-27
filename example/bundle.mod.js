(function(modules, cache, entry) {

    function innerReq(name, jumped){

        if(!cache[name]) {

            if(!modules[name]) {
              
              // if we cannot find the item within our internal map jump to
              // current root require go all requires down from there
              var rootRequire = typeof require == "function" && require;

              if (!jumped && rootRequire) return rootRequire(name, true);

              throw new Error('Cannot find module \'' + name + '\'');
            }

            var m = cache[name] = { exports: {} };

            var fn = modules [name] [0];
            

            fn( function require(x) {
                  var id = modules[name][1][x];
                  return innerReq(id ? id : x);
                }
              , m
              , m.exports);
        }
        return cache[name].exports;
    }

    for(var i = 0; i < entry.length; i++) {
      innerReq(entry[ i ]);
    }

    return innerReq;
})

(
  {
      proxyquire: [
        function(require, module, exports){
          var stubrequire = require('stubrequire');

          module.exports =  function (require_) {
            return function(request, stubs) {
              // set the stubs and require dependency
              // when stub require is invoked by the module under test it will find the stubs here
              stubrequire.stub(stubs);
              var dep = require_(request);
              stubrequire.reset();

              return dep;
            };
          };
        }
      , {}
      ]
  , stubrequire: [
        function(require, module, exports){
      
          var stubs;
          exports.proxy =  function (require_) {
            return function (request) {
              if (!stubs) return require_(request);

              var stub = stubs[request];
              if (!stub) return require_(request);
              
              return stub;
            };
          };
          exports.stub  = function (stubs_) { stubs = stubs_; };
          exports.reset = function () { stubs = null; };
        }
      , {}
    ]
  , test: [
        function(require,module,exports){
          'use strict';
          var proxyquire = require('proxyquire')(require);

          var stubs = { './bar': { wunder: function () { return 'really, really wunderbar'; } } };

          var foo = proxyquire('./src/foo', stubs);
          console.log(foo());

        }
      , {"./src/foo":'foo'}
      ]
  , foo: [
        function(require, module, exports){

          // added via transform ---->
          var require_ = require;
          require = require('stubrequire').proxy(require_);
          // <----

          var bar = require('./bar');

          module.exports = function () {
            return bar.wunder();
          };

        }
      , {"./bar":'bar'}
      ]
  , bar: [
        function(require,module,exports){
          exports.wunder = function () { 
            return 'wunderbar'; 
          };

        }
      ,{}
      ]
  }

, {}         // cache

, [ 'test' ] // entry === test 
)
;
