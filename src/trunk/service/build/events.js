module.exports = function(socket) {
  socket.emit("message", {
    content: '连接成功',
    time: new Date()
  });
  socket.on('CleanAppItemDir', function(app_item_id) {
    var CleanAppItemDir;
    CleanAppItemDir = require('./actions/CleanAppItemDir');
    return CleanAppItemDir(app_item_id, function(data) {
      return socket.emit('message', {
        content: data.toString(),
        time: new Date()
      });
    }).done();
  });
  socket.on('GenerateAppItem', function(app_item_id) {
    var GenerateBaseAppItem, GenerateConfig, model;
    GenerateBaseAppItem = require('./actions/GenerateBaseAppItem');
    GenerateConfig = require('./actions/GenerateConfig');
    model = require('./models/AppItem');
    socket.emit('message', {
      content: '开始GenerateAppItem',
      time: new Date()
    });
    return model.findByIdQ(app_item_id).then(function(doc) {
      return GenerateBaseAppItem(doc.directory, function(data) {
        return socket.emit('message', {
          content: data.toString(),
          time: new Date()
        });
      }).then(function() {
        return doc;
      });
    }).then(function(doc) {
      return GenerateConfig(doc, function(data) {
        return socket.emit('message', {
          content: data.toString(),
          time: new Date()
        });
      });
    }).done();
  });
  socket.on('GenerateConfig', function(app_item_doc) {
    var GenerateConfig, Q;
    Q = require('q');
    GenerateConfig = require('./actions/GenerateConfig');
    return Q.fcall(function() {
      return GenerateConfig(app_item_doc, function(data) {
        return socket.emit('message', {
          content: data.toString(),
          time: new Date()
        });
      });
    }).done();
  });
  socket.on("RunAppItem", function(app_item_id) {
    var RunAppItem;
    if (!app_item_id) {
      return socket.emit('message', {
        content: 'app_item_id 不能为空',
        time: new Date()
      });
    }
    RunAppItem = require('./actions/RunAppItem');
    return RunAppItem(app_item_id, function(data) {
      return socket.emit('message', {
        content: data.toString(),
        time: new Date()
      });
    });
  });
  socket.on('GenerateCodeFile', function(doc) {
    var AppItem, GenerateCodeFile, config;
    config = require('./config');
    AppItem = require('./models/AppItem');
    GenerateCodeFile = require('./actions/GenerateCodeFile');
    return AppItem.findByIdQ(doc.app_item_id).then(function(app_item_doc) {
      var file_path;
      file_path = app_item_doc.directory + doc.name;
      return GenerateCodeFile(file_path, doc.code, function(data) {
        return socket.emit('message', {
          content: data.toString(),
          time: new Date()
        });
      });
    }).done();
  });
  socket.on('RunSchameTest', function(doc) {
    var GenerateModel, GenerateSchema, Q;
    Q = require('q');
    GenerateSchema = require('./actions/GenerateSchema');
    GenerateModel = require('./actions/GenerateModel');
    return Q.fcall(function() {
      return GenerateSchema(doc, function(data) {
        return socket.emit('message', {
          content: data.toString(),
          time: new Date()
        });
      });
    }).then(function() {
      return GenerateModel(doc, function(data) {
        return socket.emit('message', {
          content: data.toString(),
          time: new Date()
        });
      });
    }).fail(function(err) {
      console.log(err);
      return socket.emit('message', {
        content: err.toString(),
        time: new Date()
      });
    }).done();
  });
  socket.on('RunActionTest', function(doc) {
    var GenerateAction, GenerateActionTest, Q, RunActionTest;
    Q = require('q');
    GenerateAction = require('./actions/GenerateAction');
    GenerateActionTest = require('./actions/GenerateActionTest');
    RunActionTest = require('./actions/RunActionTest');
    return Q.fcall(function() {
      return GenerateAction(doc, function(data) {
        return socket.emit('message', {
          content: data.toString(),
          time: new Date()
        });
      });
    }).then(function() {
      return GenerateActionTest(doc, function(data) {
        return socket.emit('message', {
          content: data.toString(),
          time: new Date()
        });
      });
    }).then(function() {
      return RunActionTest(doc, function(data) {
        return socket.emit('message', {
          content: data.toString(),
          time: new Date()
        });
      });
    }).fail(function(err) {
      console.log(err);
      return socket.emit('message', {
        content: err.toString(),
        time: new Date()
      });
    }).done();
  });
  return socket.on('RunRequrlTest', function(doc) {
    var Q, RunRequrlTest;
    Q = require('q');
    RunRequrlTest = require('./actions/RunRequrlTest');
    return Q.fcall(function() {
      return RunRequrlTest(doc, function(data) {
        return socket.emit('message', {
          content: data.toString(),
          time: new Date()
        });
      });
    }).done();
  });
};
