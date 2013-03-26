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
          module.exports = function(request, stubs) {

            // caller will not exist if in strict mode 
            var caller = arguments.callee.caller;

            var require_ = caller ? caller.arguments[0] : this;

            // set the stubs and require dependency
            // when stub require is invoked it will find the stubs here
            window.__proxyquire__stubs = stubs;
            var dep = require_(request);
            delete window.__proxyquire__stubs;

            return dep;
          };
        }
      , {}
      ]
  , stubrequire: [
        function(require, module, exports){
      
          module.exports = function (request) {
            var require = this;

            var stubs = window.__proxyquire__stubs;
            if (!stubs) return require(request);

            var stub = stubs[request];
            if (!stub) return require(request);
            
            return stub;
          };
        }
      , {}
    ]
  , test: [
        function(require,module,exports){
          'use strict';
          var proxyquire = require('proxyquire').bind(require);

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
          require = require('stubrequire').bind(require_);
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
