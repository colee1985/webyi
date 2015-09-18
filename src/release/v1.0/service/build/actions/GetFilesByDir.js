module.exports = function(dir_path) {
  var Q, deferred, fs, path;
  fs = require('fs');
  Q = require('q');
  path = require('path');
  deferred = Q.defer();
  fs.readdir(dir_path, function(err, files) {
    var item, items, stat, _i, _len, _path;
    if (err) {
      deferred.reject(err);
    }
    items = [];
    for (_i = 0, _len = files.length; _i < _len; _i++) {
      item = files[_i];
      _path = path.join(dir_path, item);
      stat = fs.statSync(_path);
      item = {
        name: path.basename(item),
        type: 'file',
        path: _path,
        ext: path.extname(item)
      };
      if (stat.isDirectory(item)) {
        item.type = 'folder';
      }
      items.push(item);
    }
    return deferred.resolve(items);
  });
  return deferred.promise;
};
