'use strict';
var fs              =  require('fs')
  , preludePath     =  require.resolve('browserify/node_modules/browser-pack/_prelude')
  , preludeHackPath =  require.resolve('./prelude')
  , hack            =  fs.readFileSync(preludeHackPath, 'utf-8');


// browser-pack reads the prelude via readfile sync so we'll override it here
// this way we can swap out what prelude it gets with this little hack
var fs_readFileSync = fs.readFileSync;
fs.readFileSync = function (path) {
  if (path === preludePath) return hack;

  var args = [].slice.call(arguments);
  return fs_readFileSync.apply(null, args);
};

exports.browserify = function (files) {
  delete require.cache[require.resolve('browserify')];
  delete require.cache[require.resolve('browserify/node_modules/browser-pack')];

  return require('browserify')(files).transform(require('./transform'));
};
