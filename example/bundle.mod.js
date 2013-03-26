function proxyquire_(request, stubs) {
  var require = this;

  window.stubs = stubs;
  var dep = require(request);
  delete window.stubs;

  return dep;
}

function stubrequire(request) {
  var require = this;

  var stubs = window.stubs;
  if (!stubs) return require(request);

  var stub = stubs[request];
  if (!stub) return require(request);
  
  return stub;
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
          var proxyquire = proxyquire_.bind(require);
          var stubs = { './bar': { wunder: function () { return 'really, really wunderbar'; } } };

          var foo = proxyquire('./src/foo', stubs);
          console.log(foo());

        }
      , {"./src/foo":'foo'}
      ]
  , foo: [
        function(require, module, exports){

          var require_ = require;
          require = stubrequire.bind(require_);

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
