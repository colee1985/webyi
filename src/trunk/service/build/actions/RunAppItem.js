module.exports = function(app_item_id, stdout) {
  var AppItem, Error, Q, base_code_dir, child_process, config, crypto, generate_to_dir, log4js, tpls_dir;
  config = require('../config');
  Q = require('q');
  crypto = require('crypto');
  log4js = require('log4js');
  Error = require('../utils/Error');
  child_process = require('child_process');
  AppItem = require('../models/AppItem');
  base_code_dir = config.base_code_dir;
  tpls_dir = config.tpls_dir;
  generate_to_dir = '';
  return Q.fcall(function() {
    return AppItem.findByIdQ(app_item_id);
  }).then(function(app_item_doc) {
    var run_process;
    generate_to_dir = app_item_doc.directory;
    run_process = process.run_apps[app_item_id];
    return process.kill(run_process.pid, 'SIGTERM');
  }).then(function(msg) {
    return msg;
  }).fail(function(err) {
    return err;
  }).then(function(msg) {
    var run_process;
    run_process = child_process.spawn('node', [generate_to_dir + 'build/main.js']);
    run_process.stdout.setEncoding('utf8');
    run_process.stdout.on('data', function(data) {
      if (stdout) {
        return stdout(data);
      }
    });
    run_process.stderr.on('data', function(data) {
      if (stdout) {
        return stdout(data);
      }
    });
    run_process.on('exit', function(code, signal) {
      msg = run_process.pid + '子进程已退出，代码：' + code;
      if (stdout) {
        return stdout(msg);
      }
    });
    run_process.on('uncaughtException', function(err) {
      if (stdout) {
        return stdout(err.toString());
      }
    });
    run_process.on('error', function(err) {
      if (stdout) {
        return stdout(err.toString());
      }
    });
    if (!process.run_apps) {
      process.run_apps = {};
    }
    return process.run_apps[app_item_id] = run_process;
  });
};
