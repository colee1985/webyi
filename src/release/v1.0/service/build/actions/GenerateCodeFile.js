module.exports = function(full_file_path, code_str, stdout) {
  var Q, coffee, dir_path, ext, file_name, fs, gulp, gutil, path, through;
  Q = require('q');
  fs = require('fs');
  path = require('path');
  through = require('through');
  gulp = require("gulp");
  coffee = require('gulp-coffee');
  gutil = require('gulp-util');
  dir_path = path.dirname(full_file_path) + '/';
  file_name = path.basename(full_file_path);
  ext = path.extname(file_name);
  return Q.fcall(function() {
    var deferred;
    deferred = Q.defer();
    fs.exists(full_file_path, function(is_exists) {
      if (!is_exists) {
        return deferred.resolve(true);
      } else {
        return fs.unlink(full_file_path, function(err) {
          if (err) {
            deferred.reject(err);
          }
          return deferred.resolve(true);
        });
      }
    });
    return deferred.promise;
  }).then(function() {
    var deferred;
    deferred = Q.defer();
    gulp.src(full_file_path).pipe(through(null, function(file) {
      var joinedFile;
      joinedFile = new gutil.File({
        cwd: dir_path,
        base: '/',
        path: '/' + file_name,
        contents: new Buffer(code_str)
      });
      this.emit('data', joinedFile);
      return this.emit('end');
    })).pipe(gulp.dest(dir_path)).on('error', function(err) {
      deferred.reject(err);
      if (stdout) {
        return stdout(err.toString());
      }
    }).on('uncaughtException', function(err) {
      deferred.reject(err);
      if (stdout) {
        return stdout(err.toString());
      }
    }).on('end', function() {
      if (stdout) {
        stdout(full_file_path + ' 完成');
      }
      return deferred.resolve(true);
    });
    return deferred.promise;
  }).then(function() {
    var build_dir, build_file_name, build_file_path, deferred, gulpfile;
    deferred = Q.defer();
    build_dir = dir_path.replace('service\/app\/', 'service\/build\/');
    build_file_path = build_dir + file_name;
    gulpfile = gulp.src(full_file_path);
    if (ext === '.coffee') {
      build_file_name = file_name.replace('.coffee', '.js');
      build_file_path = build_dir + build_file_name;
      gulpfile.pipe(coffee()).on('error', function(err) {
        deferred.reject(err);
        if (stdout) {
          return stdout(err.toString());
        }
      }).on('uncaughtException', function(err) {
        deferred.reject(err);
        if (stdout) {
          return stdout(err.toString());
        }
      });
    }
    gulpfile.pipe(gulp.dest(build_dir)).on('end', function() {
      if (stdout) {
        stdout(build_file_path + ' build 完成');
      }
      return deferred.resolve(true);
    });
    return deferred.promise;
  });
};
