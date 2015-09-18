module.exports = function(doc, stdout) {
  var Error, Q, base_code_dir, coffee, config, file_path, fs, generate_to_dir, gulp, gutil, log4js, swig, through, tpls_dir;
  config = require('../config');
  Q = require('q');
  log4js = require('log4js');
  Error = require('../utils/Error');
  swig = require('./SwigSetFilter')();
  fs = require('fs');
  through = require('through');
  gulp = require("gulp");
  gutil = require('gulp-util');
  coffee = require("gulp-coffee");
  base_code_dir = config.app_base_code;
  tpls_dir = config.app_tpls;
  generate_to_dir = config.generate2dir + doc.app_item_id + '/service/';
  file_path = '';
  return Q.fcall(function() {
    var code_str, deferred;
    if (!doc.name) {
      return true;
    }
    code_str = doc.code;
    file_path = generate_to_dir + 'app/views/' + doc.name + '.html';
    deferred = Q.defer();
    gulp.src(file_path).pipe(through(null, function(file) {
      var joinedFile;
      joinedFile = new gutil.File({
        cwd: generate_to_dir,
        base: 'app/views/',
        path: 'app/views/' + doc.name + '.html',
        contents: new Buffer(code_str)
      });
      this.emit('data', joinedFile);
      return this.emit('end');
    })).pipe(gulp.dest(generate_to_dir + 'app/views/')).on('error', function(err) {
      if (stdout) {
        return stdout(err.toString());
      }
    }).on('uncaughtException', function(err) {
      if (stdout) {
        return stdout(err.toString());
      }
    }).pipe(gulp.dest(generate_to_dir + 'build/views/')).pipe(through(null, function() {
      return deferred.resolve(true);
    }));
    return deferred.promise;
  });
};
