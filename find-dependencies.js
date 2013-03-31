'use strict';

var detective = require('detective');

function findProxyquireVars(src) {
  return detective
    .find(src, { nodes: true }).nodes
    .map(function (n) {
      var arg = n.arguments[0];
      return arg 
        && arg.value === 'proxyquireify' 
        && arg.type === 'Literal'
        && n.parent 
        && n.parent.id 
        && n.parent.id.name;
    })
    .filter(function (n) { return n; })
    ;
}

module.exports = function(src) {
  if (!/require\(.+proxyquireify.+\)/.test(src)) return [];
  
  return findProxyquireVars(src)
    .map(function (name) {
      return detective(src, { word: name });
    });
};

var fs = require('fs');
var src = fs.readFileSync(require.resolve('./test/fixtures/dependencies'), 'utf-8');

console.log(module.exports(src));
