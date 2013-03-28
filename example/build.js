var fs = require('fs')
  , browserify = require('browserify');

browserify()
  .require(require.resolve('./test'), { entry: true })
  // shouldn't be needed once proxyquireify is a proper package
  .require(require.resolve('..'), { expose: 'proxyquireify' })
  .transform(require('..').transform)
  .bundle({ debug: true })
  .pipe(fs.createWriteStream(__dirname + '/bundle.js'));


