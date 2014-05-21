var fs         = require('fs')
  , proxyquire = require('proxyquireify')
  , browserify = require('browserify')
  ;

browserify()
  .plugin(proxyquire.plugin)
  .require(require.resolve('./test'), { entry: true })
  .bundle({ debug: true })
  .pipe(fs.createWriteStream(__dirname + '/bundle.js'));
