'use strict';
/*jshint asi: true */

var browserify =  require('browserify');
var proxyquire =  require('../..');
var vm         =  require('vm');
var test       =  require('tape');

function run(name) {

  var src = '';

  browserify()
    .plugin(proxyquire.plugin)
    .require(require.resolve('../..'), { expose: 'proxyquireify' })
    .require(require.resolve('./' + name), { entry: true })
    .bundle()
    .on('error',  function error(err) { console.error(err); process.exit(1); })
    .on('data', function (data) { src += data })
    .on('end', function () {
      // require('fs').writeFileSync(require('path').join(__dirname, '../../examples/bundle.js'), src, 'utf-8')
      test(name, function(t) {
        vm.runInNewContext(src, { test: t.test.bind(t), window: {} });
      })
  });
}

run('independent-overrides')
run('manipulating-overrides')
run('noCallThru')
run('argument-validation')
