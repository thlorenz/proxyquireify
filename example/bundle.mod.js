var stubbedModules = { };

function proxyquire(id, request) {
  var require = this;

  var stubs = stubbedModules[id];
  if (!stubs) return require(request);

  var stub = stubs[request];
  if (!stub) return require(request);
  
  return stub;
}

function register(id, stubs) {
  stubbedModules[id] = stubs;
}

// modules are defined as an array
// [ module function, map of requireuires ]
//
// map of requireuires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the requireuire for previous bundles

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
    test: [
        function(require,module,exports){
          register('id:foo', { './bar': { wunder: function () { return 'really, really wunderbar'; } } });

          var foo = require('./src/foo');
          console.log(foo());

        }
      , {"./src/foo":'foo'}
      ]
  , foo: [
        function(require, module, exports){

          var require_ = require;
          require = proxyquire.bind(require_, 'id:foo');

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

, {}  // cache

, [ 'test' ] // entry === ./src/foo.js
)
;
