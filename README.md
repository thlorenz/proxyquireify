# proxyquireify [![build status](https://secure.travis-ci.org/thlorenz/proxyquireify.png)](http://travis-ci.org/thlorenz/proxyquireify)

browserify version of proxyquire. Mocks out browserify's require to allow stubbing out dependencies while testing

## Status

Very alpha, although the main functionality is there.

## Example

Lets say we have `bar.js`:

```js
exports.wunder = function () { 
  return 'wunderbar'; 
};
```

and `foo.js`:

```js
var bar = require('./bar');

module.exports = function () {
  return bar.kinder() + ' ist ' + bar.wunder();
};
```

then we can stub `bar` in a test like so:

```js
// This require needs to be called in order for browserify to include it in the bundle
require('./src/foo');

var proxyquire = require('proxyquireify')(require);

var stubs = { 
  './bar': { 
      wunder: function () { return 'wirklich wunderbar'; }
    , kinder: function () { return 'schokolade'; }
  }
};

var foo = proxyquire('./src/foo', stubs);


console.log(foo()); 
```

Finally build the bundle via `build.js`:

```js
var proxyquire = require('proxyquireify');

proxyquire.browserify()
  .require(require.resolve('./test'), { entry: true })
  .bundle({ debug: true })
  .pipe(fs.createWriteStream(__dirname + '/bundle.js'));
```

load it in the browser and see:

    schokolade ist wirklich wunderbar
