'use strict';
/*jshint asi: true */

var proxyquire =  require('..');
var vm         =  require('vm');

function run(name) {

  var src = '';

  proxyquire.browserify()
    .transform(proxyquire.transform)
    .require(require.resolve('..'), { expose: 'proxyquireify' })
    .require(require.resolve('./' + name), { entry: true })
    .bundle()
    .on('error',  function error(err) { console.error(err); process.exit(1); })
    .on('data', function (data) { src += data })
    .on('end', function () {
      // require('fs').writeFileSync(require.resolve('../example/bundle.js'), src, 'utf-8')

      vm.runInNewContext(src, { 
          setTimeout    :  setTimeout
        , clearInterval :  clearInterval
        , console       :  console
        , window        :  {}
      } );
  });
}

run('independent-overrides')
run('manipulating-overrides')
run('noCallThru')
