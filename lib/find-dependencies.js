'use strict';

var detective = require('detective');

function simpleRequire(n) {
  // var proxy = require('proxyquireify')
  return n.parent 
      && n.parent.id 
      && n.parent.id.name;
}

function requireWithImmediateCall(n) {
  // var proxy = require('proxyquireify')(require)
  var p = n.parent;
  return p.parent 
      && p.parent.id 
      && p.parent.id.name;
}

function findProxyquireVars(src) {
  return detective
    .find(src, { nodes: true }).nodes
    .map(function (n) {
      var arg = n.arguments[0];
      return arg 
        && arg.value  === 'proxyquireify' 
        && arg.type   === 'Literal'
        && ( simpleRequire(n) || requireWithImmediateCall(n) );
    })
    .filter(function (n) { return n; })
    ;
}

module.exports = function(src) {
  if (!/require\(.+proxyquireify.+\)/.test(src)) return [];
  
  // use hash to get unique values
  var hash = findProxyquireVars(src)
    .map(function (name) {
      return detective(src, { word: name });
    })
    .reduce(function (acc, arr) {
      arr.forEach(function (x) { acc[x] = true;});
      return acc;
    }, {});

  return Object.keys(hash);
};
