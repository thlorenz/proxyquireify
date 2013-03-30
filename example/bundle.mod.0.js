require=

(function(modules, cache, entry) {
    // Save the require from previous bundle to this closure if any
    var previousRequire = typeof require == "function" && require;

    function newRequire(name, jumped){
        var m = cache[name];
        var dontcache = name !== 'proxyquire';
        if(!m || dontcache) {
            if(!modules[name]) {
                // if we cannot find the the module within our internal map or
                // cache jump to the current global require ie. the last bundle
                // that was added to the page.
                var currentRequire = typeof require == "function" && require;
                if (!jumped && currentRequire) return currentRequire(name, true);

                // If there are other bundles on this page the require from the
                // previous one is saved to 'previousRequire'. Repeat this as
                // many times as there are bundles until the module is found or
                // we exhaust the require chain.
                if (previousRequire) return previousRequire(name, true);
                throw new Error('Cannot find module \'' + name + '\'');
            }
            m = cache[name] = {exports:{}};
            modules[name][0](function(x){
                var id = modules[name][1][x];
                return newRequire(id ? id : x);
            },m,m.exports);
        }
        return cache[name].exports;
    }
    for(var i=0;i<entry.length;i++) newRequire(entry[i]);

    // Override the current require with this new one
    return newRequire;
})

(
  {
  'transform':[function(require,module,exports){
  // transform was excluded from the bundle since it is only needed during the build
  },{}],
  "proxyquireify":[
    function(require,module,exports){
      module.exports=require('proxyquire');
    },{}],
    "proxyquire":[
      function(require,module,exports){
        'use strict';

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

          return function(request, stubs) {

            stub(stubs);
            console.log('require:', request);
            console.log('bar', stubs['./bar'].bar);
            var dep = require_(request);
            reset();

            return dep;
          };
        };

        proxyquire.proxy =  function (require_) {
          return function (request) {
            function original() {
              var dep = require_(request);
              return dep;
            }

            console.log('\n\nrequire_:', request);
           
            if (!stubs) return original();

            var stub = stubs[request];
            console.log('bar', stubs['./bar']);

            if (!stub) return original();

            var stubWideNoCallThru = !!stubs['@noCallThru'] && stub['@noCallThru'] !== false;
            var noCallThru = stubWideNoCallThru || !!stub['@noCallThru'];
            return noCallThru ? stub : fillMissingKeys(stub, original(true));
          };
        };

        proxyquire.transform = require('./transform');

    },{"./transform":'transform'}],
  // test
  2:[function(require,module,exports){
        console.clear && console.clear();
        console.log('==== Starting Test ====');

        var require_ = require;
        var require = require('proxyquireify').proxy(require_);

        'use strict';
        /*jshint asi: true */

        //var test       =  require('tape')
        var proxyquire =  require('proxyquireify')(require)
          , barber     =  { bar: function () { return 'barber'; } }
          ;

        console.log('-------\nrequiring foober');
        var foober =  proxyquire('./fixtures/foo', { './bar': barber });

        console.log('-------\nrequiring foo');
        var foo    =  proxyquire('./fixtures/foo', { './bar': { } });

        console.log('-------\nbrowserify requiring foo');
        require('./fixtures/foo');

        console.log('foo.bigBar()', foo.bigBar())
        console.log('foober.bigBar()', foober.bigBar())

      },{"proxyquireify":"proxyquire","./fixtures/stats":3,"./fixtures/foo":'foo'}],
  // bar
  bar:[function(require,module,exports){
    var require_ = require;
    var require = require('proxyquireify').proxy(require_);

    function bar () {
      return 'bar';
    }

    function rab () {
      return 'rab';
    }

    module.exports = { bar : bar, rab: rab };


  },{"proxyquireify":"proxyquire"}],

  // foo
  foo:[function(require,module,exports){
    var require_ = require;
    var require = require('proxyquireify').proxy(require_);
    var bar = require('./bar')
      , path = require('path')
      ;


    console.log('being required: ', bar.bar);
    function bigBar () { 
      // inline require not working in proxquireify (unlike in original proxyquire)
      return bar.bar().toUpperCase();
    }

    function bigRab () {
      // module wide require
      return bar.rab().toUpperCase();
    }

    function bigExt (file) {
      return path.extname(file).toUpperCase();
    }

    function bigBas (file) {
      return path.basename(file).toUpperCase();
    }

    module.exports = {
        bigBar: bigBar
      , bigRab: bigRab
      , bigExt: bigExt
      , bigBas: bigBas
    };

},{"proxyquireify":"proxyquire","path":'path',"./stats":3,"./bar":'bar'}],





7:[function(require,module,exports){



//////////////////////



  
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            if (ev.source === window && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],
path:[function(require,module,exports){
(function(process){function filter (xs, fn) {
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (fn(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length; i >= 0; i--) {
    var last = parts[i];
    if (last == '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Regex to split a filename into [*, dir, basename, ext]
// posix version
var splitPathRe = /^(.+\/(?!$)|\/)?((?:.+?)?(\.[^.]*)?)$/;

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
var resolvedPath = '',
    resolvedAbsolute = false;

for (var i = arguments.length; i >= -1 && !resolvedAbsolute; i--) {
  var path = (i >= 0)
      ? arguments[i]
      : process.cwd();

  // Skip empty and invalid entries
  if (typeof path !== 'string' || !path) {
    continue;
  }

  resolvedPath = path + '/' + resolvedPath;
  resolvedAbsolute = path.charAt(0) === '/';
}

// At this point the path should be resolved to a full absolute path, but
// handle relative paths to be safe (might happen when process.cwd() fails)

// Normalize the path
resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
var isAbsolute = path.charAt(0) === '/',
    trailingSlash = path.slice(-1) === '/';

// Normalize the path
path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }
  
  return (isAbsolute ? '/' : '') + path;
};


// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    return p && typeof p === 'string';
  }).join('/'));
};


exports.dirname = function(path) {
  var dir = splitPathRe.exec(path)[1] || '';
  var isWindows = false;
  if (!dir) {
    // No dirname
    return '.';
  } else if (dir.length === 1 ||
      (isWindows && dir.length <= 3 && dir.charAt(1) === ':')) {
    // It is just a slash or a drive letter with a slash
    return dir;
  } else {
    // It is a full dirname, strip trailing slash
    return dir.substring(0, dir.length - 1);
  }
};


exports.basename = function(path, ext) {
  var f = splitPathRe.exec(path)[2] || '';
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPathRe.exec(path)[3] || '';
};

exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

})(require("__browserify_process"))
},{"__browserify_process":7}],


},{},[2])
;
