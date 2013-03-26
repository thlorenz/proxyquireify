var fs = require('fs')
  , browserify = require('browserify');

browserify()
  .require(require.resolve('./test'), { entry: true })
  .bundle()
  .pipe(fs.createWriteStream(__dirname + '/bundle.js'));
