var Action, AppItem, CodeFile, Error, Q, Requrl, Schema, log4js, validator, _;

Q = require('q');

_ = require('underscore');

_.str = require('underscore.string');

log4js = require('log4js');

Error = require('./utils/Error');

validator = require('validator');

AppItem = require('./actions/AppItem');

Schema = require('./actions/Schema');

Requrl = require('./actions/Requrl');

Action = require('./actions/Action');

CodeFile = require('./actions/CodeFile');

module.exports = function(app) {
  app.get('/test', function(req, res) {
    return Q.fcall(function() {
      return GenerateFile.clean();
    }).then(function() {
      return GenerateFile.copeBase();
    }).then(function() {
      GenerateFile.routes();
      GenerateFile.schemas();
      GenerateFile.models();
      return GenerateFile.actions();
    }).then(function(str) {
      return res.send(str);
    }).fail(function(err) {
      log4js.getLogger('err').error(err);
      return res.send(err);
    }).done();
  });
  app.get('/api/file/findByDir', function(req, res) {
    var GetFilesByDir;
    GetFilesByDir = require('./actions/GetFilesByDir');
    return Q.fcall(function() {
      var dir;
      dir = req.query.dir;
      return GetFilesByDir(dir);
    }).then(function(data) {
      console.log(data, typeof data);
      return res.send(data);
    }).fail(function(err) {
      return res.send(err);
    }).done();
  });
  app.get('/api/file/findContentByPath', function(req, res) {
    var GetFileContentByPath;
    GetFileContentByPath = require('./actions/GetFileContentByPath');
    return Q.fcall(function() {
      var path;
      path = req.query.path;
      return GetFileContentByPath(path);
    }).then(function(data) {
      return res.send({
        content: data
      });
    }).fail(function(err) {
      return res.send(err);
    }).done();
  });
  app.post('/api/file/save', function(req, res) {
    var SaveFile2Path;
    SaveFile2Path = require('./actions/SaveFile2Path');
    return Q.fcall(function() {
      var content, path;
      path = req.body.path;
      content = req.body.content;
      return SaveFile2Path(path, content);
    }).then(function(data) {
      return res.send({
        content: data
      });
    }).fail(function(err) {
      return res.send(err);
    }).done();
  });
  app.post('/api/appitem/save', function(req, res) {
    return Q.fcall(function() {
      var model;
      model = req.body.model;
      console.log(model, 'doc');
      if (!model) {
        throw new Error(100010, 'model 不能为空');
      }
      return AppItem.save(req.body.model);
    }).then(function(doc) {
      return res.send(doc);
    }).fail(function(err) {
      log4js.getLogger('appitem/save err').info(err);
      return res.send(err);
    }).done();
  });
  app.get('/api/appitem/findById', function(req, res) {
    return Q.fcall(function() {
      var id;
      id = req.query._id;
      if (!id) {
        throw new Error(100010, '_id 不能为空');
      }
      return AppItem.findById(req.query._id);
    }).then(function(doc) {
      return res.send(doc);
    }).fail(function(err) {
      return res.send(err);
    }).done();
  });
  app.post('/api/appitem/del', function(req, res) {
    return Q.fcall(function() {
      var id;
      id = req.body._id;
      if (!id) {
        throw new Error(100010, '_id 不能为空');
      }
      return AppItem.del(id);
    }).then(function(doc) {
      return res.send(doc);
    }).fail(function(err) {
      return res.send(err);
    }).done();
  });
  app.get('/api/appitem/list', function(req, res) {
    return Q.fcall(function() {
      return AppItem.getList(req.query.creater_id);
    }).then(function(docs) {
      return res.send(docs);
    }).fail(function(err) {
      return res.send(err);
    }).done();
  });
  app.post('/api/schema/save', function(req, res) {
    return Q.fcall(function() {
      var model;
      model = req.body.model;
      if (!model) {
        throw new Error(100010, 'model 不能为空');
      }
      return Schema.save(model);
    }).then(function(doc) {
      return res.send(doc);
    }).fail(function(err) {
      return res.send(err);
    }).done();
  });
  app.get('/api/schema/findById', function(req, res) {
    return Q.fcall(function() {
      var id;
      id = req.query._id;
      if (!id) {
        throw new Error(100010, '_id 不能为空');
      }
      return Schema.findById(id);
    }).then(function(doc) {
      return res.send(doc);
    }).fail(function(err) {
      return res.send(err);
    }).done();
  });
  app.post('/api/schema/del', function(req, res) {
    return Q.fcall(function() {
      var id;
      id = req.body._id;
      if (!id) {
        throw new Error(100010, '_id 不能为空');
      }
      return Schema.del(id);
    }).then(function(doc) {
      return res.send(doc);
    }).fail(function(err) {
      return res.send(err);
    }).done();
  });
  app.get('/api/schema/list', function(req, res) {
    return Q.fcall(function() {
      return Schema.getList(req.query.app_item_id, req.query.creater_id);
    }).then(function(docs) {
      return res.send(docs);
    }).fail(function(err) {
      return res.send(err);
    }).done();
  });
  app.post('/api/requrl/save', function(req, res) {
    return Q.fcall(function() {
      var model;
      model = req.body.model;
      if (!model) {
        throw new Error(100010, 'model 不能为空');
      }
      return Requrl.save(req.body.model);
    }).then(function(doc) {
      return res.send(doc);
    }).fail(function(err) {
      log4js.getLogger('requrl/save err').info(err);
      return res.send(err);
    }).done();
  });
  app.get('/api/requrl/findById', function(req, res) {
    return Q.fcall(function() {
      var id;
      id = req.query._id;
      if (!id) {
        throw new Error(100010, '_id 不能为空');
      }
      return Requrl.findById(req.query._id);
    }).then(function(doc) {
      return res.send(doc);
    }).fail(function(err) {
      return res.send(err);
    }).done();
  });
  app.post('/api/requrl/del', function(req, res) {
    return Q.fcall(function() {
      var id;
      id = req.body._id;
      if (!id) {
        throw new Error(100010, '_id 不能为空');
      }
      return Requrl.del(id);
    }).then(function(doc) {
      return res.send(doc);
    }).fail(function(err) {
      return res.send(err);
    }).done();
  });
  app.get('/api/requrl/list', function(req, res) {
    return Q.fcall(function() {
      return Requrl.getList(req.query.app_item_id, req.query.creater_id);
    }).then(function(docs) {
      return res.send(docs);
    }).fail(function(err) {
      return res.send(err);
    }).done();
  });
  app.post('/api/action/save', function(req, res) {
    return Q.fcall(function() {
      var model;
      model = req.body.model;
      if (!model) {
        throw new Error(100010, 'model 不能为空');
      }
      return Action.save(req.body.model);
    }).then(function(doc) {
      return res.send(doc);
    }).fail(function(err) {
      log4js.getLogger('action/save err').info(err);
      return res.send(err);
    }).done();
  });
  app.get('/api/action/findById', function(req, res) {
    return Q.fcall(function() {
      var id;
      id = req.query._id;
      if (!id) {
        throw new Error(100010, '_id 不能为空');
      }
      return Action.findById(req.query._id);
    }).then(function(doc) {
      return res.send(doc);
    }).fail(function(err) {
      return res.send(err);
    }).done();
  });
  app.post('/api/action/del', function(req, res) {
    return Q.fcall(function() {
      var id;
      id = req.body._id;
      if (!id) {
        throw new Error(100010, '_id 不能为空');
      }
      return Action.del(id);
    }).then(function(doc) {
      return res.send(doc);
    }).fail(function(err) {
      return res.send(err);
    }).done();
  });
  app.get('/api/action/list', function(req, res) {
    return Q.fcall(function() {
      return Action.getList(req.query.app_item_id, req.query.creater_id);
    }).then(function(docs) {
      return res.send(docs);
    }).fail(function(err) {
      return res.send(err);
    }).done();
  });
  app.post('/api/codefile/save', function(req, res) {
    return Q.fcall(function() {
      var model;
      model = req.body.model;
      if (!model) {
        throw new Error(100010, 'model 不能为空');
      }
      return CodeFile.save(req.body.model);
    }).then(function(doc) {
      return res.send(doc);
    }).fail(function(err) {
      return res.send(err);
    }).done();
  });
  app.get('/api/codefile/findById', function(req, res) {
    return Q.fcall(function() {
      var id;
      id = req.query._id;
      if (!id) {
        throw new Error(100010, '_id 不能为空');
      }
      return CodeFile.findById(req.query._id);
    }).then(function(doc) {
      return res.send(doc);
    }).fail(function(err) {
      return res.send(err);
    }).done();
  });
  app.post('/api/codefile/del', function(req, res) {
    return Q.fcall(function() {
      var id;
      id = req.body._id;
      if (!id) {
        throw new Error(100010, '_id 不能为空');
      }
      return CodeFile.del(id);
    }).then(function(doc) {
      return res.send(doc);
    }).fail(function(err) {
      return res.send(err);
    }).done();
  });
  app.get('/api/codefile/list', function(req, res) {
    return Q.fcall(function() {
      return CodeFile.getList(req.query.app_item_id, req.query.creater_id);
    }).then(function(docs) {
      return res.send(docs);
    }).fail(function(err) {
      return res.send(err);
    }).done();
  });
  return function(req, res, next) {
    return next();
  };
};
