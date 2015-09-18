module.exports = function(file_path, content) {
  var Q, deferred, fs, path;
  fs = require('fs');
  Q = require('q');
  path = require('path');
  deferred = Q.defer();
  fs.writeFile(file_path, content, function(err, data) {
    if (err) {
      deferred.reject(err);
    }
    return deferred.resolve(true);
  });
  return deferred.promise;
};
