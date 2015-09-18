module.exports = function(app_item_directory) {
  var Error, Q, base_code_dir, clean, code_tpl, config, generate_to_dir, gulp, log4js, through, tpls_dir;
  config = require('../config');
  Q = require('q');
  log4js = require('log4js');
  Error = require('../utils/Error');
  gulp = require('gulp');
  clean = require('gulp-clean');
  through = require('through');
  code_tpl = require('co-service-code-templates');
  base_code_dir = code_tpl.app_base_code;
  tpls_dir = code_tpl.app_tpls;
  generate_to_dir = app_item_directory;
  return Q.fcall(function() {
    var deferred;
    deferred = Q.defer();
    gulp.src(generate_to_dir, {
      read: false
    }).pipe(clean()).pipe(through(null, function() {
      return deferred.resolve(true);
    }));
    return deferred.promise;
  });
};
