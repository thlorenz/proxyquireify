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
          var stubs;

          function stub(stubs_) { stubs = stubs_; }
          function reset() { stubs = null; }

          function fillMissingKeys(mdl, original) {
            Object.keys(original).forEach(function (key) {
              if (!mdl[key])  mdl[key] = original[key];
            });

            return mdl;
          }

          var proxyquire = module.exports = function (require_) {
            reset();

            return function(request, stubs) {

              // set the stubs and require dependency
              // when stub require is invoked by the module under test it will find the stubs here
              stub(stubs);
              var dep = require_(request);
              reset();

              return dep;
            };
          };

          proxyquire.proxy =  function (require_) {
            return function (request) {
              function original() {
                return require_(request);
              }

              if (!stubs) return original();

              var stub = stubs[request];
              if (!stub) return original();

              var noCallThru = (!!stubs['@noCallThru'] && stub['@noCallThru'] !== false) || !!stub['@noCallThru'];
              return noCallThru ? stub : fillMissingKeys(stub, original());
            };
          };
        }
      , {}
      ]
  , test: [
        function(require,module,exports){
          'use strict';
          var proxyquire = require('proxyquire')(require);

          var stubs = { 
                './bar': { 
                  wunder: function () { return 'really, really wunderbar'; }
              , '@noCallThru': false
              }
              , '@noCallThru': true
          };

          var foo = proxyquire('./src/foo', stubs);
          console.log(foo());

        }
      , {"./src/foo":'foo'}
      ]
  , foo: [
        function(require, module, exports){

          // added via transform ---->
          var require_ = require;
          require = require('proxyquire').proxy(require_);
          // <----

          var bar = require('./bar');

          module.exports = function () {
            return bar.kinder() + ' ist ' + bar.wunder();
          };

        }
      , {"./bar":'bar'}
      ]
  , bar: [
        function(require,module,exports){
          exports.wunder = function () { 
            return 'wunderbar'; 
          };
          exports.kinder = function () {
            return 'schokolade';
          };
        }
      ,{}
      ]
  }

, {}         // cache

, [ 'test' ] // entry === test 
)
;
