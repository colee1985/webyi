module.exports = function(doc, stdout) {
  var AppItem, Mocha, Q, base_code_dir, child_process, config, file_path, generate_to_dir, log4js, run, tpls_dir;
  config = require('../config');
  Q = require('q');
  log4js = require('log4js');
  Mocha = require('mocha');
  child_process = require('child_process');
  AppItem = require('../models/AppItem');
  base_code_dir = config.base_code_dir;
  tpls_dir = config.tpls_dir;
  generate_to_dir = '';
  file_path = '';
  run = null;
  return Q.fcall(function() {
    return AppItem.findByIdQ(doc.app_item_id);
  }).then(function(app_item_doc) {
    var command, deferred, dest_file_path;
    generate_to_dir = app_item_doc.directory;
    dest_file_path = generate_to_dir + 'build/tests/routes/' + doc.title + '.test.js';
    deferred = Q.defer();
    command = process.platform === 'win32' ? 'mocha.cmd' : 'mocha';
    run = child_process.spawn(command, ['-R', 'dot', '-C', dest_file_path]);
    run.stdout.setEncoding('utf8');
    run.stdout.pipe(process.stdout);
    run.stderr.pipe(process.stderr);
    if (stdout) {
      run.stdout.on('data', stdout);
      run.stderr.on('data', stdout);
    }
    run.on('uncaughtException', function(err) {
      if (stdout) {
        return stdout(err);
      }
    });
    run.on('error', function(err) {
      if (stdout) {
        stdout(err);
      }
      return console.log(err);
    });
    run.on('exit', function(code, signal) {
      return deferred.resolve(code);
    });
    return deferred.promise;
  });
};
