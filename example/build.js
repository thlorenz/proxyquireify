var fs         =  require('fs')
  , proxyquire =  require('..')
  ;


proxyquire.browserify()
  .transform(proxyquire.transform)
  .require(require.resolve('./test'), { entry: true })
  // shouldn't be needed once proxyquireify is a proper package
  .require(require.resolve('..'), { expose: 'proxyquireify' })
  .transform(require('..').transform)
  .bundle({ debug: true })
  .pipe(fs.createWriteStream(__dirname + '/bundle.js'));


