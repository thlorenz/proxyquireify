# proxyquireify [![build status](https://secure.travis-ci.org/thlorenz/proxyquireify.png)](http://travis-ci.org/thlorenz/proxyquireify)

browserify v2 version of [proxyquire](https://github.com/thlorenz/proxyquire). 

Proxies browserify's require in order to make overriding dependencies during testing easy while staying **totally unobstrusive**.

**Table of Contents**  *generated with [DocToc](http://doctoc.herokuapp.com/)*

- [Features](#features)
- [Installation](#installation)
- [Example](#example)
- [API](#api)
  - [proxyquire.browserify()](#proxyquirebrowserify)
  - [proxyquire(request: String, stubs: Object)](#proxyquirerequest:-string-stubs:-object)
    - [Important Magic](#important-magic)
  - [noCallThru](#nocallthru)
- [More Examples](#more-examples)

## Features

- **no changes to your code** are necessary
- non overriden methods of a module behave like the original
- mocking framework agnostic, if it can stub a function then it works with proxyquireify
- "use strict" compliant
- [automatic injection](https://github.com/thlorenz/proxyquireify#important-magic) of `require` calls to ensure the
  module you are testing gets bundled 

## Installation

    npm install proxyquireify

## Example 

**foo.js**:

```js
var bar = require('./bar');

module.exports = function () {
  return bar.kinder() + ' ist ' + bar.wunder();
};
```

**foo.test.js**:

```js
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

**browserify.build.js**:

```js
var proxyquire = require('proxyquireify');

proxyquire.browserify()
  .require(require.resolve('./foo.test'), { entry: true })
  .bundle({ debug: true })
  .pipe(fs.createWriteStream(__dirname + '/bundle.js'));
```

load it in the browser and see:

    schokolade ist wirklich wunderbar

## API

### proxyquire.browserify()

To be used in build script instead of `browserify()`, autmatically adapts browserify to work for tests and injects
require overrides into all modules via a browserify transform.

```js
proxyquire.browserify()
  .require(require.resolve('./test'), { entry: true })
  .bundle()
  .pipe(fs.createWriteStream(__dirname + '/bundle.js'));
```

### proxyquire.plugin()

Instead of being used instead of `browserify()`, proxyquireify can also be used as a browserify plugin.

```js
var browserify = require('browserify');
var proxyquire = require('proxyquireify');

browserify()
  .plugin(proxyquire.plugin)
  .require(require.resolve('./test'), { entry: true })
  .bundle()
  .pipe(fs.createWriteStream(__dirname + '/bundle.js'));
```

The plugin is also exported from the file plugin.js so that you can use proxyquireify when running browserify
from the command line.

```sh
browserify -p proxyquireify/plugin test.js > bundle.js
```

### proxyquire(request: String, stubs: Object)

- **request**: path to the module to be tested e.g., `../lib/foo`
- **stubs**: key/value pairs of the form `{ modulePath: stub, ... }`
  - module paths are relative to the tested module **not** the test file 
  - therefore specify it exactly as in the require statement inside the tested file
  - values themselves are key/value pairs of functions/properties and the appropriate override

```js
var proxyquire =  require('proxyquireify')(require);
var barStub    =  { wunder: function () { 'really wonderful'; } };

var foo = proxyquire('./foo', { './bar': barStub })
```

#### Important Magic 

In order for browserify to include the module you are testing in the bundle, proxyquireify will inject a
`require()` call for every module you are proxyquireing. So in the above example `require('./foo')` will be injected at
the top of your test file.

### noCallThru

By default proxyquireify calls the function defined on the *original* dependency whenever it is not found on the stub.

If you prefer a more strict behavior you can prevent *callThru* on a per module or per stub basis.

If *callThru* is disabled, you can stub out modules that weren't even included in the bundle. **Note**, that unlike in
proxquire, there is no option to prevent call thru globally.

```js
// Prevent callThru for path module only
var foo = proxyquire('./foo', {
    path: {
      extname: function (file) { ... }
    , '@noCallThru': true
    }
  , fs: { readdir: function (..) { .. } }
});

// Prevent call thru for all contained stubs (path and fs)
var foo = proxyquire('./foo', {
    path: {
      extname: function (file) { ... }
    }
  , fs: { readdir: function (..) { .. } }
  , '@noCallThru': true
});

// Prevent call thru for all stubs except path
var foo = proxyquire('./foo', {
    path: {
      extname: function (file) { ... }
    , '@noCallThru': false
    }
  , fs: { readdir: function (..) { .. } }
  , '@noCallThru': true
});
```

## More Examples

- [foobar](https://github.com/thlorenz/proxyquireify/tree/master/examples/foobar)
