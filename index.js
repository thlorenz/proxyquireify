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

    var stubWideNoCallThru = !!stubs['@noCallThru'] && stub['@noCallThru'] !== false;
    var noCallThru = stubWideNoCallThru || !!stub['@noCallThru'];
    return noCallThru ? stub : fillMissingKeys(stub, original());
  };
};

proxyquire.transform = require('./transform');
