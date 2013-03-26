var fs = require('fs')
  , browserify = require('browserify');

browserify()
  .require(require.resolve('./src/foo'), { expose: 'foo' })
  .require(require.resolve('..'), { expose: 'proxyquireify' })
  .require(require.resolve('./test'), { entry: true })
  .transform(require('../transform'))
  .bundle()
  .pipe(fs.createWriteStream(__dirname + '/bundle.js'));


