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
    return AppItem.findByIdQ(doc.app_item_id);
  }).then(function(app_item_doc) {
    var code_str;
    generate_to_dir = app_item_doc.directory;
    if (!doc.title) {
      throw 'doc.title 不能为空';
    }
    code_str = swig.compileFile(tpls_dir + 'requrl.test.coffee.html');
    code_str = code_str({
      doc: doc,
      server_port: appItem_doc.server_port
    });
    file_path = generate_to_dir + 'app/tests/routes/' + doc.title + '.test.coffee';
    return GenerateCodeFile(file_path, code_str, stdout);
  });
};
