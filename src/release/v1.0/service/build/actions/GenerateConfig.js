module.exports = function(doc, stdout) {
  var AppItem, Error, GenerateCodeFile, Q, base_code_dir, config, file_path, generate_to_dir, log4js, swig, tpls_dir;
  config = require('../config');
  Q = require('q');
  log4js = require('log4js');
  Error = require('../utils/Error');
  swig = require('./SwigSetFilter')();
  GenerateCodeFile = require('./GenerateCodeFile');
  AppItem = require('../models/AppItem');
  base_code_dir = config.app_base_code;
  tpls_dir = config.app_tpls;
  generate_to_dir = '';
  file_path = '';
  return Q.fcall(function() {
    if (!(doc || doc.server_port)) {
      return true;
    }
    return AppItem.findByIdQ(doc._id);
  }).then(function(app_item_doc) {
    var code_str;
    generate_to_dir = app_item_doc.directory;
    code_str = swig.compileFile(tpls_dir + 'config.coffee.html');
    code_str = code_str({
      doc: doc
    });
    file_path = generate_to_dir + 'app/config.coffee';
    return GenerateCodeFile(file_path, code_str, stdout);
  });
};
