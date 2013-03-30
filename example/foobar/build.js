var fs         =  require('fs')
  , proxyquire =  require('proxyquireify')
  ;

proxyquire.browserify()
  .require(require.resolve('./test'), { entry: true })
  .bundle({ debug: true })
  .pipe(require('mold-source-map').transformSourcesRelativeTo(__dirname))
  .pipe(fs.createWriteStream(__dirname + '/bundle.js'));
