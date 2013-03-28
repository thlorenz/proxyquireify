// added via transform ---->
var require_ = require;
var proxyquire = require('../../index');
require = proxyquire.proxy(require_);
// <----

var bar = require('./bar');

module.exports = function () {
  return bar.kinder() + ' ist ' + bar.wunder();
};
