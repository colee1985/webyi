module.exports = function(doc, stdout) {
  var AppItem, GenerateCodeFile, Q, base_code_dir, config, file_path, generate_to_dir, log4js, swig, tpls_dir;
  config = require('../config');
  Q = require('q');
  log4js = require('log4js');
  swig = require('./SwigSetFilter')();
  GenerateCodeFile = require('./GenerateCodeFile');
  AppItem = require('../models/AppItem');
  base_code_dir = config.app_base_code;
  tpls_dir = config.app_tpls;
  generate_to_dir = '';
  file_path = '';
  return Q.fcall(function() {
    return AppItem.findByIdQ(doc.app_item_id);
  }).then(function(app_item_doc) {
    var code_str;
    if (!app_item_doc) {
      throw '项目不存在';
    }
    if (!doc.name) {
      throw 'doc.name 不能为空';
    }
    generate_to_dir = app_item_doc.directory;
    code_str = swig.compileFile(tpls_dir + 'action.coffee.html');
    code_str = code_str({
      doc: doc
    });
    file_path = generate_to_dir + 'app/actions/' + doc.name + '.coffee';
    return GenerateCodeFile(file_path, code_str, stdout);
  });
};
