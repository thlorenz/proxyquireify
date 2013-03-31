'use strict';

function ProxyquireifyError(msg) {
  this.name = 'ProxyquireifyError';
  Error.captureStackTrace(this, ProxyquireifyError);
  this.message = msg || 'An error occurred inside proxyquireify.';
}

function validateArguments(request, stubs) {
  var msg = (function getMessage() {
    if (!request)
      return 'Missing argument: "request". Need it to resolve desired module.';

    if (!stubs)
      return 'Missing argument: "stubs". If no stubbing is needed, use regular require instead.';

    if (typeof request != 'string')
      return 'Invalid argument: "request". Needs to be a requirable string that is the module to load.';

    if (typeof stubs != 'object')
      return 'Invalid argument: "stubs". Needs to be an object containing overrides e.g., {"path": { extname: function () { ... } } }.';
  })();

  if (msg) throw new ProxyquireifyError(msg);
}

var stubs;

function stub(stubs_) { 
  stubs = stubs_; 
}

function reset() { 
  stubs = undefined; 
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

    validateArguments(request, stubs);

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

if (require.cache) {
  // only used during build, so prevent browserify from including it
  var hackPrelude = './lib/hack-prelude';
  proxyquire.browserify = require(hackPrelude).browserify;
}
