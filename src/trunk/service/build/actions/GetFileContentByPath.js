module.exports = function(file_path) {
  var Q, fs, path;
  fs = require('fs');
  Q = require('q');
  path = require('path');
  return Q.fcall(function() {
    var deferred;
    deferred = Q.defer();
    fs.readFile(file_path, function(err, data) {
      if (err) {
        return deferred.reject(err);
      }
      return deferred.resolve(data.toString());
    });
    return deferred.promise;
  });
};
