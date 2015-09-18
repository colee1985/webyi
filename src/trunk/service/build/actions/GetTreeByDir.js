module.exports = function(filepath) {
  var fs, path, tree;
  fs = require("fs");
  path = require("path");
  tree = function(filepath) {
    var result, stats;
    filepath = path.normalize(filepath);
    stats = fs.lstatSync(filepath);
    result = {
      path: filepath,
      name: path.basename(filepath)
    };
    if (stats.isDirectory()) {
      result.type = "folder";
      if (result.name !== "node_modules" && result.name !== 'vender') {
        result.children = fs.readdirSync(filepath).map(function(child) {
          return tree(filepath + "/" + child);
        });
      }
    } else {
      result.type = "file";
    }
    return result;
  };
  return tree(filepath);
};
