module.exports = function(app_item_directory, stdout) {
  var Error, Q, base_code_dir, child_process, coffee, config, generate_to_dir, gulp, log4js, swig, through, tpls_dir;
  config = require('../config');
  Q = require('q');
  log4js = require('log4js');
  Error = require('../utils/Error');
  swig = require('./SwigSetFilter')();
  gulp = require('gulp');
  through = require('through');
  coffee = require("gulp-coffee");
  child_process = require('child_process');
  base_code_dir = config.app_base_code;
  tpls_dir = config.app_tpls;
  generate_to_dir = app_item_directory;
  return Q.fcall(function() {
    var deferred;
    deferred = Q.defer();
    gulp.src([base_code_dir + '**/*']).pipe(gulp.dest(generate_to_dir)).pipe(through(null, function() {
      return deferred.resolve(true);
    }));
    return deferred.promise;
  }).then(function() {
    var deferred;
    deferred = Q.defer();
    gulp.src([generate_to_dir + 'app/**/*.coffee']).pipe(coffee({
      'bare': true
    })).on('error', function(err) {
      if (stdout) {
        return stdout(err.toString());
      }
    }).on('uncaughtException', function(err) {
      if (stdout) {
        return stdout(err.toString());
      }
    }).pipe(gulp.dest(generate_to_dir + 'build/')).pipe(through(null, function() {
      stdout('生成成功');
      return deferred.resolve(true);
    }));
    return deferred.promise;
  }).then(function() {
    var deferred, npm, run_process;
    deferred = Q.defer();
    if (process.platform === "win32") {
      npm = 'npm.cmd';
    } else {
      npm = 'npm';
    }
    run_process = child_process.spawn(npm, ['install'], {
      cwd: generate_to_dir
    });
    run_process.stdout.setEncoding('utf8');
    run_process.stdout.on('data', stdout);
    run_process.stderr.on('data', stdout);
    run_process.on('exit', function(code, signal) {
      var msg;
      msg = run_process.pid + '子进程已退出，代码：' + code;
      stdout(msg);
      return deferred.resolve(true);
    });
    run_process.on('error', stdout);
    run_process.on('uncaughtException', stdout);
    return deferred.promise;
  });
};
