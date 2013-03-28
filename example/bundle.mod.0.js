;
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
            var m = cache[name] = {exports:{}};
            modules[name][0](function(x){
                var id = modules[name][1][x];
                return innerReq(id ? id : x);
            },m,m.exports);
        }
        return cache[name].exports
    }
    for(var i=0;i<entry.length;i++) innerReq(entry[i]);
    return innerReq;
})
({

1:[function(require,module,exports){
  // test

  'use strict';
  var proxyquire = require('../index')(require);

  var stubs = { 
    './bar': { 
        wunder: function () { return 'really, really wunderbar'; }
      , kinder: function () { return 'schokolade'; }
    }
  };

  var foo = proxyquire('./src/foo', stubs);
  require('./src/foo');

  console.log(foo());

  },{"../index":2,"./src/foo":3}],

2:[function(require,module,exports){

  // proxyquire
  
  'use strict';

  var stubs;

  function stub(stubs_) { 
    stubs = stubs_; 
  }

  function reset() { 
    stubs = null; 
  }

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

      console.log('requiring', request);
      var dep = require_(request);
      reset();

      return dep;
    };
  };

  proxyquire.proxy =  function (require_) {
    return function (request) {

      console.log('proxying', request);
      function original() {
        return require_(request);
      }

      if (!stubs) return original();

      var stub = stubs[request];
      if (!stub) return original();

      var stubWideNoCallThru = !!stubs['@noCallThru'] && stub['@noCallThru'] !== false;
      var noCallThru = stubWideNoCallThru || !!stub['@noCallThru'];
      return noCallThru ? stub : fillMissingKeys(stub, original());
    };
  };

},{}],

3:[function(require,module,exports){

  // foo
  
  // added via transform ---->
  var require_ = require;
  var proxyquire = require('../../index');
  require = proxyquire.proxy(require_);
  // <----

  var bar = require('./bar');

  module.exports = function () {
    return bar.kinder() + ' ist ' + bar.wunder();
  };

  },{"../../index":2,"./bar":4}],

4:[function(require,module,exports){
  // bar
  exports.wunder = function () { 
    return 'wunderbar'; 
  };

},{}]},{},[1])
;
