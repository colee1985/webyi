(function(window){
"use strict"
var ag;

ag = angular.module("CoWebYi", ['CoWebYiTemplates', 'ui.router', 'pascalprecht.translate', 'ui.codemirror', 'ui.ace']);

ag.config([
  '$locationProvider', '$translateProvider', '$urlRouterProvider', '$stateProvider', function($locationProvider, $translateProvider, $urlRouterProvider, $stateProvider) {
    var lang;
    lang = "en";
    $translateProvider.preferredLanguage(lang);
    $stateProvider.state('ide', {
      url: '/ide',
      views: {
        "sidebar": {
          templateUrl: "templates/ide-sidebar.html"
        },
        "container": {
          templateUrl: "templates/ide-form.html"
        }
      }
    });
    $stateProvider.state('schema', {
      url: '/schema',
      views: {
        "sidebar": {
          templateUrl: "templates/project-sidebar.html"
        },
        "container": {
          templateUrl: "templates/schema-form.html"
        }
      }
    });
    $stateProvider.state('schema.create', {
      url: '/create'
    });
    $stateProvider.state('schema.update', {
      url: '/update/:_id'
    });
    $stateProvider.state('requrl', {
      url: '/requrl',
      views: {
        "sidebar": {
          templateUrl: "templates/project-sidebar.html"
        },
        "container": {
          templateUrl: "templates/requrl-form.html"
        }
      }
    });
    $stateProvider.state('requrl.create', {
      url: '/create'
    });
    $stateProvider.state('requrl.update', {
      url: '/update/:_id'
    });
    $stateProvider.state('action', {
      url: '/action',
      views: {
        "sidebar": {
          templateUrl: "templates/project-sidebar.html"
        },
        "container": {
          templateUrl: "templates/action-form.html"
        }
      }
    });
    $stateProvider.state('action.create', {
      url: '/create'
    });
    $stateProvider.state('action.update', {
      url: '/update/:_id'
    });
    $stateProvider.state('codefile', {
      url: '/codefile',
      views: {
        "sidebar": {
          templateUrl: "templates/project-sidebar.html"
        },
        "container": {
          templateUrl: "templates/codefile-form.html"
        }
      }
    });
    $stateProvider.state('codefile.create', {
      url: '/create'
    });
    $stateProvider.state('codefile.update', {
      url: '/update/:_id'
    });
    $stateProvider.state('appitem', {
      url: '/appitem',
      views: {
        "sidebar": {
          templateUrl: "templates/app-item-sidebar.html"
        },
        "container": {
          templateUrl: "templates/app-item-form.html"
        }
      }
    });
    $stateProvider.state('appitem.create', {
      url: '/create'
    });
    $stateProvider.state('appitem.update', {
      url: '/update/:_id'
    });
    return $urlRouterProvider.otherwise('/appitem');
  }
]);

ag.controller('ActionCtrl', [
  'AppConfig', '$scope', 'Action', '$state', '$stateParams', 'SocketConnect', function(app, $scope, Action, $state, $stateParams, socket) {
    $scope.app = app;
    app.active = 'action';
    if ($state.is('action.create')) {
      $scope.model = Action.create();
    } else if ($state.is('action.update')) {
      Action.findById($stateParams._id).then(function(data) {
        if (data.error_code) {
          throw data;
        }
        return $scope.$apply(function() {
          return $scope.model = data;
        });
      }).fail(function(err) {
        return $state.go('action.create');
      }).done();
    }
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      return $state.reload();
    });
    $scope.addParame = function() {
      return $scope.model.parames.push(new Action.getParame());
    };
    $scope.delParame = function(index) {
      return $scope.model.parames.splice(index, 1);
    };
    $scope.save = function() {
      return Action.save($scope.model).then(function(res) {
        $state.go('action.update', {
          _id: res._id
        });
        console.log(res._id);
        return res;
      }).then(function(doc) {
        return socket.emit('RunActionTest', doc);
      }).fail(function(err) {
        return console.log(err);
      }).done();
    };
    return $scope.aceLoaded = function(_editor) {
      _editor.setFontSize(14);
      _editor.getSession().setUseSoftTabs(false);
      return _editor.getSession().setTabSize(4);
    };
  }
]);

ag.controller('AppItemCtrl', [
  'AppConfig', '$scope', 'AppItem', '$state', '$stateParams', 'SocketConnect', function(app, $scope, AppItem, $state, $stateParams, socket) {
    $scope.app = app;
    app.active = 'appitem';
    $scope.config = (function() {
      return {
        debug: true
      };
    })();
    if ($state.is('appitem.create')) {
      $scope.model = AppItem.create();
    } else if ($state.is('appitem.update')) {
      AppItem.findById($stateParams._id).then(function(data) {
        return $scope.$apply(function() {
          return $scope.model = data;
        });
      });
    } else {
      $scope.model = AppItem.create();
    }
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      return $state.reload();
    });
    return $scope.save = function() {
      return AppItem.save($scope.model).then(function(res) {
        $state.go('appitem.update', {
          _id: res._id
        });
        return res;
      }).then(function(doc) {
        return socket.emit('GenerateConfig', doc);
      }).fail(function(err) {
        return console.log(err);
      }).done();
    };
  }
]);

ag.controller('AppItemSidebarCtrl', [
  'AppConfig', '$scope', '$state', 'AppItem', function(app, $scope, $state, AppItem) {
    $scope.app = app;
    $scope.AppItem = AppItem;
    Q.fcall(function() {
      return AppItem.getList();
    }).then(function(res) {
      return $scope.$apply();
    });
    $scope.del = function(model, index) {
      AppItem.del(model._id);
      return $scope.appitems.splice(index, 1);
    };
    return $scope.intoProject = function(app_item_id) {
      window.localStorage.app_item_id = app_item_id;
      return $state.go('schema.create');
    };
  }
]);

ag.controller('CodeFileCtrl', [
  'AppConfig', '$scope', 'CodeFile', '$state', '$stateParams', 'SocketConnect', function(app, $scope, CodeFile, $state, $stateParams, socket) {
    $scope.app = app;
    app.active = 'codefile';
    if ($state.is('codefile.create')) {
      $scope.model = CodeFile.create();
    } else if ($state.is('codefile.update')) {
      CodeFile.findById($stateParams._id).then(function(data) {
        if (data.error_code) {
          throw data;
        }
        return $scope.$apply(function() {
          return $scope.model = data;
        });
      }).fail(function(err) {
        return $state.go('codefile.create');
      }).done();
    }
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      return $state.reload();
    });
    $scope.code_types = CodeFile.code_types;
    $scope.save = function() {
      return CodeFile.save($scope.model).then(function(res) {
        $state.go('codefile.update', {
          _id: res._id
        });
        console.log(res._id);
        return res;
      }).then(function(doc) {
        return socket.emit('GenerateCodeFile', doc);
      }).fail(function(err) {
        return console.log(err);
      }).done();
    };
    return $scope.aceLoaded = function(_editor) {
      _editor.setFontSize(14);
      _editor.getSession().setUseSoftTabs(false);
      return _editor.getSession().setTabSize(4);
    };
  }
]);

ag.controller('IdeCtrl', [
  'AppConfig', '$scope', 'FileModel', function(app, $scope, FileModel) {
    $scope.app = app;
    app.active = 'ide';
    $scope.FileModel = FileModel;
    return $scope.activeTab = function(item) {
      FileModel.active_tab = item.path;
      return FileModel.showInEdit(item);
    };
  }
]);

ag.controller('IdeSidebarCtrl', [
  'AppConfig', '$scope', 'FileModel', 'AppItem', function(app, $scope, FileModel, AppItem) {
    $scope.app = app;
    app.active = 'ide';
    app.getCurAppItemId().then(function(app_item_id) {
      return AppItem.findById(app_item_id);
    }).then(function(app_item_doc) {
      return $scope.$apply(function() {
        return $scope.item = {
          path: app_item_doc.directory,
          name: app_item_doc.name,
          type: 'folder'
        };
      });
    });
    $scope.getChilds = function(item) {
      if (item.type === 'folder') {
        if (!item.childs) {
          return FileModel.findByDir(item.path + '/').then(function(data) {
            return $scope.$apply(function() {
              return item.childs = data;
            });
          });
        } else {
          return item.childs = null;
        }
      }
    };
    return $scope.edit = function(item) {
      if (item.type === 'file') {
        return FileModel.addSelect(item);
      }
    };
  }
]);

ag.controller('NavbarCtrl', [
  'AppConfig', '$scope', function(app, $scope) {
    return $scope.app = app;
  }
]);

ag.controller('ProjectSidebarCtrl', [
  'AppConfig', '$scope', 'SocketConnect', 'Logger', 'Schema', 'Requrl', 'Action', 'CodeFile', function(app, $scope, socket, Logger, Schema, Requrl, Action, CodeFile) {
    $scope.app = app;
    $scope.Action = Action;
    $scope.Schema = Schema;
    $scope.Requrl = Requrl;
    $scope.CodeFile = CodeFile;
    Q.all([Schema.getList(), Requrl.getList(), Action.getList(), CodeFile.getList()]).then(function(res) {
      return $scope.$apply();
    });
    $scope.del = function(models_name, model, index) {
      if (models_name === 'schema') {
        Schema.del(model._id);
        return $scope.schemas.splice(index, 1);
      } else if (models_name === 'requrl') {
        Requrl.del(model._id);
        return $scope.requrls.splice(index, 1);
      } else if (models_name === 'action') {
        Action.del(model._id);
        return $scope.actions.splice(index, 1);
      } else if (models_name === 'view') {
        CodeFile.del(model._id);
        return $scope.actions.splice(index, 1);
      } else {
        return console.log('无效删除操作');
      }
    };
    $scope.generateAppItem = function() {
      app.getCurAppItemId().then(function(id) {
        return socket.emit('GenerateAppItem', id);
      }).done();
      return true;
    };
    $scope.runAppItem = function() {
      app.getCurAppItemId().then(function(id) {
        return socket.emit('RunAppItem', id);
      }).done();
      return true;
    };
    return $scope.loggerShow = function() {
      return Logger.show();
    };
  }
]);

ag.controller('RequrlCtrl', [
  'AppConfig', '$scope', 'Requrl', '$state', '$stateParams', 'SocketConnect', function(app, $scope, Requrl, $state, $stateParams, socket) {
    $scope.app = app;
    app.active = 'requrl';
    $scope.requrl = Requrl;
    if ($state.is('requrl.create')) {
      $scope.model = Requrl.create();
    } else if ($state.is('requrl.update')) {
      Requrl.findById($stateParams._id).then(function(data) {
        if (data.error_code) {
          throw data;
        }
        return $scope.$apply(function() {
          return $scope.model = data;
        });
      }).fail(function(err) {
        return $state.go('requrl.create');
      }).done();
    }
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      return $state.reload();
    });
    $scope.addParame = function(method) {
      return $scope.model[method].push(new Requrl.getParame());
    };
    $scope.delParame = function(method, index) {
      return $scope.model[method].splice(index, 1);
    };
    $scope.save = function() {
      return Requrl.save($scope.model).then(function(res) {
        $state.go('requrl.update', {
          _id: res._id
        });
        console.log(res._id);
        return res;
      }).then(function(doc) {
        return socket.emit('RunRequrlTest', doc);
      });
    };
    $scope.editorOptions = (function() {
      return {
        height: '100%',
        mode: 'text/x-coffeescript',
        autoMatchParens: true,
        textWrapping: true,
        lineNumbers: true,
        indentUnit: 4,
        indentWithTabs: true,
        theme: 'ambiance'
      };
    })();
    return $scope.themes = ['default', '3024-day', '3024-night', 'ambiance', 'base16-dark', 'base16-light', 'blackboard', 'cobalt', 'eclipse', 'elegant', 'erlang-dark', 'lesser-dark', 'mbo', 'mdn-like', 'midnight', 'monokai', 'neat', 'neo', 'night', 'paraiso-dark', 'paraiso-light', 'pastel-on-dark', 'rubyblue', 'solarized dark', 'solarized light', 'the-matrix', 'tomorrow-night-eighties', 'twilight', 'vibrant-ink', 'xq-dark', 'xq-light'];
  }
]);

ag.controller('SchemaCtrl', [
  'AppConfig', '$scope', 'Schema', '$state', '$stateParams', 'SocketConnect', function(app, $scope, Schema, $state, $stateParams, socket) {
    $scope.app = app;
    app.active = 'schema';
    if ($state.is('schema.create')) {
      $scope.schema = Schema.create();
    } else if ($state.is('schema.update')) {
      Schema.findById($stateParams._id).then(function(data) {
        return $scope.$apply(function() {
          return $scope.schema = data;
        });
      });
    }
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      return $state.reload();
    });
    $scope.field_types = Schema.field_types;
    $scope.schemas = [];
    Schema.getList().then(function(docs) {
      return $scope.$apply(function() {
        var doc, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = docs.length; _i < _len; _i++) {
          doc = docs[_i];
          _results.push($scope.schemas.push(doc.model_name));
        }
        return _results;
      });
    });
    $scope.addField = function() {
      return $scope.schema.fields.push(new Schema.default_field());
    };
    $scope.delField = function(index) {
      return $scope.schema.fields.splice(index, 1);
    };
    $scope.addEnum = function(field) {
      return field.enums.push({
        value: ''
      });
    };
    $scope.delEnum = function(field, index) {
      return field.enums.splice(index, 1);
    };
    return $scope.save = function() {
      return Schema.save($scope.schema).then(function(res) {
        $state.go('schema.update', {
          _id: res._id
        });
        return res;
      }).then(function(doc) {
        return socket.emit('RunSchameTest', doc);
      }).fail(function(err) {
        return console.log(err);
      }).done();
    };
  }
]);

ag.directive("coOnDrag", [
  '$document', function($document) {
    return {
      priority: 100,
      restrict: "EA",
      scope: {
        onMove: "=coOnDrag",
        initX: '@',
        initY: '@'
      },
      link: function(scope, element, attrs) {
        var mousemove, mouseup, startX, startY, x, y;
        x = scope.initX || 0;
        y = scope.initY || 0;
        startY = 0;
        startX = 0;
        mousemove = function(event) {
          y = event.screenY - startY;
          x = event.screenX - startX;
          return scope.onMove(x, y);
        };
        mouseup = function() {
          $document.unbind("mousemove", mousemove);
          return $document.unbind("mouseup", mouseup);
        };
        return element.on("mousedown", function(event) {
          event.preventDefault();
          startX = event.screenX - x;
          startY = event.screenY - y;
          $document.on("mousemove", mousemove);
          return $document.on("mouseup", mouseup);
        });
      }
    };
  }
]);

var factory;

ag.directive("coRadio", factory = function() {
  return {
    priority: 100,
    template: '<div class="btn-group"> <button class="btn" ng-class="{active:select==item.key}" ng-repeat="item in enums" ng-click="setRadio(item)">{{item.value}}</button> </div>',
    replace: true,
    transclude: true,
    restrict: "AE",
    require: '?ngModel',
    scope: {
      enums: "=coRadio"
    },
    link: function(scope, element, attrs, ctrl) {
      if (ctrl) {
        ctrl.$render = function() {
          return scope.select = ctrl.$modelValue;
        };
        return scope.setRadio = function(item) {
          scope.select = item.key;
          return ctrl.$setViewValue(item.key);
        };
      }
    }
  };
});

var factory;

ag.directive("dialog", factory = function() {
  return {
    priority: 100,
    templateUrl: "templates/dialog.html",
    replace: true,
    transclude: true,
    restrict: "E",
    scope: {
      title: "@",
      onOk: "&",
      onCancel: "&",
      visible: "@"
    }
  };
});

ag.directive("onCtrlS", function() {
  return {
    priority: 100,
    restrict: "AE",
    scope: {
      onCtrlS: "&"
    },
    link: function(scope, element, attrs) {
      return $(element).bind('keydown', function(e) {
        if (e.ctrlKey && e.keyCode === 83) {
          console.log('onCtrlS');
          scope.$apply(function() {
            return scope.onCtrlS();
          });
          return e.preventDefault();
        }
      });
    }
  };
});

var factory;

ag.directive("planStatus", factory = function() {
  return {
    priority: 100,
    templateUrl: "templates/plan-status.html",
    replace: true,
    restrict: "AE",
    require: '?ngModel',
    scope: {
      save: "&planStatus"
    },
    link: function(scope, element, attrs, ctrl) {
      if (ctrl) {
        ctrl.$render = function() {
          return scope.status = ctrl.$modelValue;
        };
        return scope.setStatus = function(item) {
          scope.status = item;
          ctrl.$setViewValue(item);
          return scope.save();
        };
      }
    }
  };
});

ag.factory('Action', [
  'AppConfig', 'toast', 'GlobalLoading', '$rootScope', function(app, toast, GlobalLoading, $scope) {
    var getParame, model;
    getParame = function() {
      return {
        name: '',
        value: '',
        intro: ''
      };
    };
    model = function() {
      return {
        name: null,
        parames: [new getParame()],
        intro: null,
        code: null,
        test_code: null,
        creater_id: null,
        app_item_id: null,
        plan_status: 'inprogress'
      };
    };
    return {
      _models: [],
      getParame: getParame,
      create: function() {
        return new model();
      },
      findById: function(_id) {
        var deferred;
        GlobalLoading.show();
        deferred = Q.defer();
        $.ajax({
          type: 'GET',
          url: app.api_domain + 'action/findById',
          data: {
            _id: _id,
            time: (new Date()).getTime()
          },
          dataType: 'JSON',
          success: function(data) {
            deferred.resolve(data);
            return GlobalLoading.hide();
          },
          error: function(reason) {
            toast.show(reason.toString());
            deferred.reject(reason);
            return GlobalLoading.hide();
          }
        });
        return deferred.promise;
      },
      save: function(model) {
        var ths;
        ths = this;
        GlobalLoading.show();
        return Q.all([app.getLoginerId(), app.getCurAppItemId()]).then(function(res) {
          var deferred;
          model.creater_id = res[0];
          model.app_item_id = res[1];
          deferred = Q.defer();
          $.ajax({
            type: 'POST',
            url: app.api_domain + 'action/save',
            data: {
              model: model,
              time: (new Date()).getTime()
            },
            dataType: 'JSON',
            success: function(data) {
              GlobalLoading.hide();
              if (data.error_code) {
                return deferred.reject(data);
              }
              if (!model._id) {
                $scope.$apply(function() {
                  return ths._models.push(data);
                });
              }
              return deferred.resolve(data);
            },
            error: function(reason) {
              GlobalLoading.hide();
              return deferred.reject(reason);
            }
          });
          return deferred.promise;
        });
      },
      del: function(_id) {
        var deferred, ths;
        ths = this;
        GlobalLoading.show();
        deferred = Q.defer();
        $.ajax({
          type: 'POST',
          url: app.api_domain + 'action/del',
          data: {
            _id: _id,
            time: (new Date()).getTime()
          },
          dataType: 'JSON',
          success: function(data) {
            deferred.resolve(data);
            return GlobalLoading.hide();
          },
          error: function(reason) {
            deferred.reject(reason);
            return GlobalLoading.hide();
          }
        });
        return deferred.promise;
      },
      delByIndex: function(index) {
        var ths;
        ths = this;
        model = this._models[index];
        return this.del(model._id).then(function(res) {
          return $scope.$apply(function() {
            return ths._models.splice(index, 1);
          });
        });
      },
      getList: function() {
        var ths;
        ths = this;
        GlobalLoading.show();
        return Q.all([app.getLoginerId(), app.getCurAppItemId()]).then(function(res) {
          var app_item_id, creater_id, deferred;
          creater_id = res[0];
          app_item_id = res[1];
          deferred = Q.defer();
          $.ajax({
            type: 'GET',
            url: app.api_domain + 'action/list',
            data: {
              creater_id: creater_id,
              app_item_id: app_item_id,
              time: (new Date()).getTime()
            },
            dataType: 'JSON',
            success: function(data) {
              ths._models = data;
              deferred.resolve(data);
              return GlobalLoading.hide();
            },
            error: function(reason) {
              deferred.reject(reason);
              return GlobalLoading.hide();
            }
          });
          return deferred.promise;
        });
      }
    };
  }
]);

ag.factory('AppConfig', [
  '$compile', '$templateCache', '$rootScope', function($compile, $templateCache, $rootScope) {
    return {
      api_domain: '/api/',
      name: 'WEBYI',
      active: 'home',
      getLoginerId: function() {
        return Q.fcall(function() {
          return '53a15d7648e4e96427b888db';
        });
      },
      getCurAppItemId: function() {
        return Q.fcall(function() {
          return window.localStorage.app_item_id;
        });
      }
    };
  }
]);

ag.factory('AppItem', [
  'AppConfig', 'toast', 'GlobalLoading', '$rootScope', function(app, toast, GlobalLoading, $scope) {
    var model;
    model = function() {
      return {
        name: '',
        debug: true,
        server_port: 1080,
        db_host: '127.0.0.1',
        db_port: 27017,
        db_name: '',
        db_username: 'root',
        db_password: '',
        other_conf: ''
      };
    };
    return {
      models: [],
      create: function() {
        return new model();
      },
      findById: function(_id) {
        var deferred;
        GlobalLoading.show();
        deferred = Q.defer();
        $.ajax({
          type: 'GET',
          url: app.api_domain + 'appitem/findById',
          data: {
            _id: _id,
            time: (new Date()).getTime()
          },
          dataType: 'JSON',
          success: function(data) {
            deferred.resolve(data);
            return GlobalLoading.hide();
          },
          error: function(reason) {
            toast.show(reason.toString());
            deferred.reject(reason);
            return GlobalLoading.hide();
          }
        });
        return deferred.promise;
      },
      save: function(model) {
        GlobalLoading.show();
        return Q.all([app.getLoginerId(), app.getCurAppItemId()]).then(function(res) {
          var deferred;
          model.creater_id = res[0];
          deferred = Q.defer();
          $.ajax({
            type: 'POST',
            url: app.api_domain + 'appitem/save',
            data: {
              model: model,
              time: (new Date()).getTime()
            },
            dataType: 'JSON',
            success: function(data) {
              deferred.resolve(data);
              return GlobalLoading.hide();
            },
            error: function(reason) {
              deferred.reject(reason);
              return GlobalLoading.hide();
            }
          });
          return deferred.promise;
        });
      },
      del: function(_id) {
        var deferred;
        GlobalLoading.show();
        deferred = Q.defer();
        $.ajax({
          type: 'POST',
          url: app.api_domain + 'appitem/del',
          data: {
            _id: _id,
            time: (new Date()).getTime()
          },
          dataType: 'JSON',
          success: function(data) {
            deferred.resolve(data);
            return GlobalLoading.hide();
          },
          error: function(reason) {
            deferred.reject(reason);
            return GlobalLoading.hide();
          }
        });
        return deferred.promise;
      },
      delByIndex: function(index) {
        var ths;
        ths = this;
        model = this._models[index];
        return this.del(model._id).then(function(res) {
          return $scope.$apply(function() {
            return ths._models.splice(index, 1);
          });
        });
      },
      getList: function() {
        var ths;
        ths = this;
        GlobalLoading.show();
        return Q.all([app.getLoginerId(), app.getCurAppItemId()]).then(function(res) {
          var app_item_id, creater_id, deferred;
          creater_id = res[0];
          app_item_id = res[1];
          deferred = Q.defer();
          $.ajax({
            type: 'GET',
            url: app.api_domain + 'appitem/list',
            data: {
              creater_id: creater_id,
              time: (new Date()).getTime()
            },
            dataType: 'JSON',
            success: function(data) {
              ths._models = data;
              deferred.resolve(data);
              return GlobalLoading.hide();
            },
            error: function(reason) {
              deferred.reject(reason);
              return GlobalLoading.hide();
            }
          });
          return deferred.promise;
        });
      }
    };
  }
]);

ag.factory('CodeFile', [
  'AppConfig', 'toast', 'GlobalLoading', '$rootScope', function(app, toast, GlobalLoading, $scope) {
    var code_types, model;
    code_types = ["html", "javascript", "coffee", "css", "stylus"];
    model = function() {
      return {
        name: '',
        code: '',
        intro: '',
        creater_id: '',
        app_item_id: '',
        code_type: '',
        plan_status: 'inprogress'
      };
    };
    return {
      code_types: code_types,
      _models: [],
      create: function() {
        return new model();
      },
      findById: function(_id) {
        var deferred;
        GlobalLoading.show();
        deferred = Q.defer();
        $.ajax({
          type: 'GET',
          url: app.api_domain + 'codefile/findById',
          data: {
            _id: _id,
            time: (new Date()).getTime()
          },
          dataType: 'JSON',
          success: function(data) {
            deferred.resolve(data);
            return GlobalLoading.hide();
          },
          error: function(reason) {
            toast.show(reason.toString());
            deferred.reject(reason);
            return GlobalLoading.hide();
          }
        });
        return deferred.promise;
      },
      save: function(model) {
        var ths;
        ths = this;
        GlobalLoading.show();
        return Q.all([app.getLoginerId(), app.getCurAppItemId()]).then(function(res) {
          var deferred;
          model.creater_id = res[0];
          model.app_item_id = res[1];
          deferred = Q.defer();
          $.ajax({
            type: 'POST',
            url: app.api_domain + 'codefile/save',
            data: {
              model: model,
              time: (new Date()).getTime()
            },
            dataType: 'JSON',
            success: function(data) {
              GlobalLoading.hide();
              if (data.error_code) {
                return deferred.reject(data);
              }
              if (!model._id) {
                $scope.$apply(function() {
                  return ths._models.push(data);
                });
              }
              return deferred.resolve(data);
            },
            error: function(reason) {
              GlobalLoading.hide();
              return deferred.reject(reason);
            }
          });
          return deferred.promise;
        });
      },
      del: function(_id) {
        var deferred, ths;
        ths = this;
        GlobalLoading.show();
        deferred = Q.defer();
        $.ajax({
          type: 'POST',
          url: app.api_domain + 'codefile/del',
          data: {
            _id: _id,
            time: (new Date()).getTime()
          },
          dataType: 'JSON',
          success: function(data) {
            deferred.resolve(data);
            return GlobalLoading.hide();
          },
          error: function(reason) {
            deferred.reject(reason);
            return GlobalLoading.hide();
          }
        });
        return deferred.promise;
      },
      delByIndex: function(index) {
        var ths;
        ths = this;
        model = this._models[index];
        return this.del(model._id).then(function(res) {
          return $scope.$apply(function() {
            return ths._models.splice(index, 1);
          });
        });
      },
      getList: function() {
        var ths;
        ths = this;
        GlobalLoading.show();
        return Q.all([app.getLoginerId(), app.getCurAppItemId()]).then(function(res) {
          var app_item_id, creater_id, deferred;
          creater_id = res[0];
          app_item_id = res[1];
          deferred = Q.defer();
          $.ajax({
            type: 'GET',
            url: app.api_domain + 'codefile/list',
            data: {
              creater_id: creater_id,
              app_item_id: app_item_id,
              time: (new Date()).getTime()
            },
            dataType: 'JSON',
            success: function(data) {
              ths._models = data;
              deferred.resolve(data);
              return GlobalLoading.hide();
            },
            error: function(reason) {
              deferred.reject(reason);
              return GlobalLoading.hide();
            }
          });
          return deferred.promise;
        });
      }
    };
  }
]);

ag.factory('FileModel', [
  'AppConfig', 'toast', 'GlobalLoading', '$rootScope', function(app, toast, GlobalLoading, $scope) {
    return {
      code_types: {
        coffee: 'coffee',
        js: 'javascript',
        html: 'html',
        css: 'css',
        styl: 'stylus',
        less: 'less'
      },
      findByDir: function(dir) {
        var deferred;
        GlobalLoading.show();
        deferred = Q.defer();
        $.ajax({
          type: 'GET',
          url: app.api_domain + 'file/findByDir',
          data: {
            dir: dir,
            time: (new Date()).getTime()
          },
          dataType: 'JSON',
          success: function(data) {
            deferred.resolve(data);
            return GlobalLoading.hide();
          },
          error: function(reason) {
            toast.show(reason.toString());
            deferred.reject(reason);
            return GlobalLoading.hide();
          }
        });
        return deferred.promise;
      },
      findContentByPath: function(path) {
        var deferred;
        GlobalLoading.show();
        deferred = Q.defer();
        $.ajax({
          type: 'GET',
          url: app.api_domain + 'file/findContentByPath',
          data: {
            path: path,
            time: (new Date()).getTime()
          },
          dataType: 'JSON',
          success: function(data) {
            deferred.resolve(data);
            return GlobalLoading.hide();
          },
          error: function(reason) {
            toast.show(reason.toString());
            deferred.reject(reason);
            return GlobalLoading.hide();
          }
        });
        return deferred.promise;
      },
      selects: [],
      addSelect: function(item) {
        var in_array;
        in_array = this.selects.some(function(_item) {
          if (item.name === _item.name && item.path === _item.path) {
            return true;
          }
        });
        if (!in_array) {
          this.selects.push(item);
        }
        this.active_tab = item.path;
        return this.showInEdit(item);
      },
      removeSelect: function(index) {
        return this.selects.splice(index, 1);
      },
      showInEdit: function(item) {
        var ext;
        if (!item.code) {
          this.findContentByPath(item.path).then(function(data) {
            item.code = data.content;
            return $scope.$apply();
          });
        }
        ext = item.name.split('.')[1];
        item.code_type = this.code_types[ext];
        return this.active_item = item;
      },
      save: function() {
        var deferred, item;
        item = this.active_item;
        GlobalLoading.show();
        deferred = Q.defer();
        $.ajax({
          type: 'POST',
          url: app.api_domain + 'file/save',
          data: {
            path: item.path,
            content: item.code,
            time: (new Date()).getTime()
          },
          dataType: 'JSON',
          success: function(data) {
            deferred.resolve(data);
            return GlobalLoading.hide();
          },
          error: function(reason) {
            toast.show(reason.toString());
            deferred.reject(reason);
            return GlobalLoading.hide();
          }
        });
        return deferred.promise;
      }
    };
  }
]);


/*
全局LOADING层
e.g
GlobalLoading.show()
GlobalLoading.hide()
 */
ag.factory('GlobalLoading', function() {
  var container, el, linking_number;
  container = 'body';
  el = $('<div></div>').addClass('Co-loading').css({
    opacity: 0.85,
    zIndex: 99999,
    position: 'fixed',
    padding: '20px 30px',
    color: '#fff',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    textAlign: 'center'
  }).text('……加载中……').appendTo(container).hide();
  linking_number = 0;
  return {
    show: (function(_this) {
      return function() {
        el.show();
        return linking_number++;
      };
    })(this),
    hide: (function(_this) {
      return function() {
        linking_number--;
        if (linking_number < 1) {
          return el.hide();
        }
      };
    })(this)
  };
});

ag.factory('Logger', [
  '$rootScope', function($rootScope) {
    var logger;
    logger = log4javascript.getLogger('test');
    logger.show = function() {
      var popUpAppender;
      popUpAppender = new log4javascript.PopUpAppender();
      logger.addAppender(popUpAppender);
      return logger.warn('开启 log4jjavascript!');
    };
    return logger;
  }
]);

ag.factory('Requrl', [
  'AppConfig', 'toast', 'GlobalLoading', '$rootScope', function(app, toast, GlobalLoading, $scope) {
    var getParame, model, request_types, value_types;
    request_types = ["GET", "POST", "PUT", "PATCH", "DELETE", "COPY", "HEAD", "OPTIONS", "LINK", "UNLINK", "PURGE", "ALL"];
    value_types = ['TEXT', 'EXPRESS', 'FILE'];
    getParame = function() {
      return {
        name: '',
        value: '',
        value_type: 'TEXT',
        is_require: false,
        intro: ''
      };
    };
    model = function() {
      return {
        title: '',
        path: '',
        type: 'GET',
        intro: '',
        headers: [new getParame()],
        gets: [new getParame()],
        posts: [new getParame()],
        code: '',
        test_code: '',
        creater_id: null,
        app_item_id: null,
        plan_status: 'inprogress'
      };
    };
    return {
      request_types: request_types,
      getParame: getParame,
      value_types: value_types,
      _models: [],
      create: function() {
        return new model();
      },
      findById: function(_id) {
        var deferred;
        GlobalLoading.show();
        deferred = Q.defer();
        $.ajax({
          type: 'GET',
          url: app.api_domain + 'requrl/findById',
          data: {
            _id: _id,
            time: (new Date()).getTime()
          },
          dataType: 'JSON',
          success: function(data) {
            deferred.resolve(data);
            return GlobalLoading.hide();
          },
          error: function(reason) {
            toast.show(reason.toString());
            deferred.reject(reason);
            return GlobalLoading.hide();
          }
        });
        return deferred.promise;
      },
      save: function(model) {
        var deferred;
        GlobalLoading.show();
        deferred = Q.defer();
        return Q.all([app.getLoginerId(), app.getCurAppItemId()]).then(function(res) {
          model.creater_id = res[0];
          model.app_item_id = res[1];
          $.ajax({
            type: 'POST',
            url: app.api_domain + 'requrl/save',
            data: {
              model: model,
              time: (new Date()).getTime()
            },
            dataType: 'JSON',
            success: function(data) {
              deferred.resolve(data);
              return GlobalLoading.hide();
            },
            error: function(reason) {
              deferred.reject(reason);
              return GlobalLoading.hide();
            }
          });
          return deferred.promise;
        });
      },
      del: function(_id) {
        var deferred;
        GlobalLoading.show();
        deferred = Q.defer();
        $.ajax({
          type: 'POST',
          url: app.api_domain + 'requrl/del',
          data: {
            _id: _id,
            time: (new Date()).getTime()
          },
          dataType: 'JSON',
          success: function(data) {
            deferred.resolve(data);
            return GlobalLoading.hide();
          },
          error: function(reason) {
            deferred.reject(reason);
            return GlobalLoading.hide();
          }
        });
        return deferred.promise;
      },
      delByIndex: function(index) {
        var ths;
        ths = this;
        model = this._models[index];
        return this.del(model._id).then(function(res) {
          return $scope.$apply(function() {
            return ths._models.splice(index, 1);
          });
        });
      },
      getList: function() {
        var ths;
        ths = this;
        GlobalLoading.show();
        return Q.all([app.getLoginerId(), app.getCurAppItemId()]).then(function(res) {
          var app_item_id, creater_id, deferred;
          creater_id = res[0];
          app_item_id = res[1];
          deferred = Q.defer();
          $.ajax({
            type: 'GET',
            url: app.api_domain + 'requrl/list',
            data: {
              creater_id: creater_id,
              app_item_id: app_item_id,
              time: (new Date()).getTime()
            },
            dataType: 'JSON',
            success: function(data) {
              ths._models = data;
              deferred.resolve(data);
              return GlobalLoading.hide();
            },
            error: function(reason) {
              deferred.reject(reason);
              return GlobalLoading.hide();
            }
          });
          return deferred.promise;
        });
      }
    };
  }
]);

ag.factory('Schema', [
  'AppConfig', 'toast', 'GlobalLoading', '$rootScope', function(app, toast, GlobalLoading, $scope) {
    var default_field, field_types, model;
    field_types = ['ObjectId', 'String', 'Number', 'Date', 'Array', 'Email', 'Mixed'];
    default_field = function() {
      return {
        name: '',
        type: 'String',
        sub_schema: '',
        enums: [],
        "default": '',
        intro: ''
      };
    };
    model = function() {
      return {
        model_name: '',
        table_name: '',
        fields: [new default_field()],
        creater_id: null,
        app_item_id: null,
        plan_status: 'inprogress'
      };
    };
    return {
      field_types: field_types,
      default_field: default_field,
      model: model,
      _models: [],
      create: function() {
        return new model();
      },
      findById: function(_id) {
        var deferred;
        GlobalLoading.show();
        deferred = Q.defer();
        $.ajax({
          type: 'GET',
          url: app.api_domain + 'schema/findById',
          data: {
            _id: _id,
            time: (new Date()).getTime()
          },
          dataType: 'JSON',
          success: function(data) {
            deferred.resolve(data);
            return GlobalLoading.hide();
          },
          error: function(reason) {
            toast.show(reason);
            deferred.reject(reason);
            return GlobalLoading.hide();
          }
        });
        return deferred.promise;
      },
      save: function(model) {
        GlobalLoading.show();
        return Q.all([app.getLoginerId(), app.getCurAppItemId()]).then(function(res) {
          var deferred;
          model.creater_id = res[0];
          model.app_item_id = res[1];
          deferred = Q.defer();
          $.ajax({
            type: 'POST',
            url: app.api_domain + 'schema/save',
            data: {
              model: model,
              time: (new Date()).getTime()
            },
            dataType: 'JSON',
            success: function(data) {
              deferred.resolve(data);
              return GlobalLoading.hide();
            },
            error: function(reason) {
              deferred.reject(reason);
              return GlobalLoading.hide();
            }
          });
          return deferred.promise;
        });
      },
      del: function(_id) {
        var deferred;
        GlobalLoading.show();
        deferred = Q.defer();
        $.ajax({
          type: 'POST',
          url: app.api_domain + 'schema/del',
          data: {
            _id: _id,
            time: (new Date()).getTime()
          },
          dataType: 'JSON',
          success: function(data) {
            deferred.resolve(data);
            return GlobalLoading.hide();
          },
          error: function(reason) {
            deferred.reject(reason);
            return GlobalLoading.hide();
          }
        });
        return deferred.promise;
      },
      delByIndex: function(index) {
        var ths;
        ths = this;
        model = this._models[index];
        return this.del(model._id).then(function(res) {
          return $scope.$apply(function() {
            return ths._models.splice(index, 1);
          });
        });
      },
      getList: function() {
        var ths;
        ths = this;
        GlobalLoading.show();
        return Q.all([app.getLoginerId(), app.getCurAppItemId()]).then(function(res) {
          var app_item_id, creater_id, deferred;
          creater_id = res[0];
          app_item_id = res[1];
          deferred = Q.defer();
          $.ajax({
            type: 'GET',
            url: app.api_domain + 'schema/list',
            data: {
              creater_id: creater_id,
              app_item_id: app_item_id,
              time: (new Date()).getTime()
            },
            dataType: 'JSON',
            success: function(data) {
              ths._models = data;
              deferred.resolve(data);
              return GlobalLoading.hide();
            },
            error: function(reason) {
              deferred.reject(reason);
              return GlobalLoading.hide();
            }
          });
          return deferred.promise;
        });
      }
    };
  }
]);

ag.factory('SocketConnect', [
  'AppConfig', 'toast', 'GlobalLoading', '$rootScope', 'Logger', function(app, toast, GlobalLoading, $scope, Logger) {
    var socket;
    socket = io.connect("/");
    socket.on('message', function(data) {
      Logger.info(data);
      return GlobalLoading.hide();
    });
    return {
      emit: function(event_name, data) {
        GlobalLoading.show('运行测试……');
        return socket.emit(event_name, data);
      }
    };
  }
]);


/*
弱提示
e.g
toast.show('这里是话题')
toast.show('只显示最新的')
 */
ag.factory('toast', function() {
  var container;
  container = 'body';
  return {
    show: function(text) {
      var el;
      el = $('<div></div>').addClass('Co-toast').css({
        opacity: 0.85,
        zIndex: 99999,
        position: 'fixed',
        background: '#000',
        padding: '20px 30px',
        color: '#fff',
        borderRadius: 6
      }).text(text).appendTo(container);
      return el.css({
        top: ($(window).height() - el.outerHeight()) * 0.5,
        left: ($(window).width() - el.outerWidth()) * 0.5
      }).delay(3000).fadeOut(400);
    }
  };
});

angular.module("CoWebYiTemplates", []).run(["$templateCache", function($templateCache) {$templateCache.put("templates/action-form.html","<div ng-controller=\"ActionCtrl\" class=\"action-main\">\r\n	<form ng-submit=\"save()\" method=\"post\" accept-charset=\"utf-8\" on-ctrl-s=\"save()\">\r\n		<ul class=\"form-header\" ng-init=\"show_tab=2\">\r\n			<li ng-click=\"show_tab=1\" ng-class=\"{active: show_tab==1}\">需求配置</li>\r\n			<li ng-click=\"show_tab=2\" ng-class=\"{active: show_tab==2}\">实现代码</li>\r\n			<li ng-click=\"show_tab=3\" ng-class=\"{active: show_tab==3}\">测试代码</li>\r\n		</ul>\r\n		<div class=\"form-main no-code\" ng-if=\"show_tab==1\">\r\n			<div>\r\n				<textarea ng-model=\"model.intro\" placeholder=\"函数功能说明\"></textarea>\r\n			</div>\r\n			<div>\r\n				<input type=\"text\" ng-model=\"model.name\" placeholder=\"函数名称\" />\r\n			</div>\r\n			<h4>参数</h4>\r\n			<ul>\r\n				<li ng-repeat=\"parame in model.parames\">\r\n					<input ng-model=\"parame.name\" type=\"text\" placeholder=\"参数名称\" />\r\n					<input ng-model=\"parame.value\" type=\"text\" placeholder=\"参数值\" />\r\n					<input ng-model=\"parame.intro\" type=\"text\" placeholder=\"参数描述\" />\r\n					<a class=\"btn\" ng-click=\"delParame($index)\">-</a>\r\n				</li>\r\n				<li><a class=\"btn\" ng-click=\"addParame()\">+增加</a></li>\r\n			</ul>\r\n		</div>\r\n		<div class=\'form-main\' ng-if=\"show_tab==2\">\r\n			<div ui-ace=\"{\r\n				useWrapMode : true,\r\n				showGutter: true,\r\n				theme:\'monokai\',\r\n				mode: \'coffee\',\r\n				onLoad: aceLoaded\r\n			}\" ng-model=\"model.code\" placeholder=\"实现代码\"></div>\r\n		</div>\r\n		<div class=\'form-main\' ng-if=\"show_tab==3\">\r\n			<div ui-ace=\"{\r\n				useWrapMode : true,\r\n				showGutter: true,\r\n				theme:\'monokai\',\r\n				mode: \'coffee\',\r\n				onLoad: aceLoaded\r\n			}\" ng-model=\"model.test_code\" placeholder=\"测试代码\"></div>\r\n		</div>\r\n		<div class=\"form-footer\">\r\n			<input class=\"btn btn-primary\" type=\"submit\" value=\"保存\" />\r\n		</div>\r\n	</form>\r\n</div>");
$templateCache.put("templates/app-item-form.html","<div ng-controller=\"AppItemCtrl\" class=\"config-main\">\r\n	<form ng-submit=\"save()\" method=\"post\" accept-charset=\"utf-8\" on-ctrl-s=\"save()\">\r\n		<ul class=\"form-header\" ng-init=\"show_tab=1\">\r\n			<li ng-click=\"show_tab=1\" ng-class=\"{active: show_tab==1}\">主配置</li>\r\n			<li ng-click=\"show_tab=2\" ng-class=\"{active: show_tab==2}\">其它配置</li>\r\n		</ul>\r\n		<div class=\"form-main no-code\" ng-if=\"show_tab==1\">\r\n			<div>\r\n				应用名称：<input type=\"text\" ng-model=\"model.name\" />\r\n			</div>\r\n			<div>\r\n				使用端口：<input type=\"text\" ng-model=\"model.server_port\" />\r\n			</div>\r\n			<div>\r\n				存放目录：<input type=\"text\" ng-model=\"model.directory\" />\r\n			</div>\r\n			<div>\r\n				开启DEBUG模式：\r\n				<div co-radio=\"[{key:false, value:\'关闭\'},{key:true,value:\'开启\'}]\" ng-model=\"model.debug\"></div>\r\n			</div>\r\n			<dl>\r\n				<dt>数据库配置</dt>\r\n				<dd>HOST： <input type=\"text\" ng-model=\"model.db_host\" /></dd>\r\n				<dd>端口： <input type=\"text\" ng-model=\"model.db_port\" /></dd>\r\n				<dd>库名： <input type=\"text\" ng-model=\"model.db_name\" /></dd>\r\n				<dd>用户名： <input type=\"text\" ng-model=\"model.db_username\" /></dd>\r\n				<dd>密码： <input type=\"text\" ng-model=\"model.db_password\" /></dd>\r\n			</dl>\r\n		</div>\r\n		<div class=\'form-main\' ng-if=\"show_tab==2\">\r\n			<div ui-ace=\"{\r\n				useWrapMode : true,\r\n				showGutter: true,\r\n				theme:\'monokai\',\r\n				mode: \'coffee\',\r\n				onLoad: aceLoaded\r\n			}\" ng-model=\"model.other_conf\" placeholder=\"其它配置\"></div>\r\n		</div>\r\n		<div class=\"form-footer\">\r\n			<input class=\"btn btn-primary\" type=\"submit\" value=\"保存\" />\r\n		</div>\r\n	</form>\r\n</div>");
$templateCache.put("templates/app-item-sidebar.html","<ul ng-controller=\"AppItemSidebarCtrl\">\r\n	<li>\r\n		<h4>项目管理</h4>\r\n		<a ui-sref=\"appitem.create\" class=\"icon-plus sidebar-add-btn\" title=\"添加\"></a>\r\n		<ul>\r\n			<li class=\"sidebar-item-li\" ng-repeat=\"appitem in AppItem._models\">\r\n				<a ui-sref=\"appitem.update({_id: appitem._id})\" class=\"title\">\r\n					<span>{{appitem.name}}</span>\r\n				</a>\r\n				<a class=\"icon-minus right\" ng-click=\"AppItem.delByIndex($index)\" title=\"删除\"></a>\r\n				<a class=\"icon-plus-sign right\" title=\"测试\"></a>\r\n				<a class=\"icon-play right\" title=\"进入项目\" ng-click=\"intoProject(appitem._id)\"></a>\r\n			</li>\r\n		</ul>\r\n	</li>\r\n</ul>");
$templateCache.put("templates/codefile-form.html","<div ng-controller=\"CodeFileCtrl\" class=\"codefile-main\">\r\n	<form ng-submit=\"save()\" method=\"post\" accept-charset=\"utf-8\" on-ctrl-s=\"save()\">\r\n		<ul class=\"form-header\" ng-init=\"show_tab=2\">\r\n			<li ng-click=\"show_tab=1\" ng-class=\"{active: show_tab==1}\">需求配置</li>\r\n			<li ng-click=\"show_tab=2\" ng-class=\"{active: show_tab==2}\">实现代码</li>\r\n			<li>\r\n				<span>代码类型:</span>\r\n				<select class=\"td-input\" ng-model=\"model.code_type\" ng-options=\"code_type for code_type in code_types\"></select>\r\n			</li>\r\n		</ul>\r\n		<div class=\"form-main no-code\" ng-if=\"show_tab==1\">\r\n			<div>\r\n				<textarea ng-model=\"model.intro\" placeholder=\"文件说明\"></textarea>\r\n			</div>\r\n			<div>\r\n				<input type=\"text\" ng-model=\"model.name\" placeholder=\"文件名称\" />\r\n			</div>\r\n		</div>\r\n		<div class=\'form-main\' ng-if=\"show_tab==2\">\r\n			<div ui-ace=\"{\r\n				useWrapMode : true,\r\n				showGutter: true,\r\n				theme:\'monokai\',\r\n				mode: model.code_type,\r\n				onLoad: aceLoaded\r\n			}\" ng-model=\"model.code\" placeholder=\"代码\"></div>\r\n		</div>\r\n		<div class=\"form-footer\">\r\n			<input class=\"btn btn-primary\" type=\"submit\" value=\"保存\" />\r\n		</div>\r\n	</form>\r\n</div>");
$templateCache.put("templates/dialog.html","<div ng-show=\"visible\" class=\"modal\">\r\n	<div class=\"modal-header\">\r\n		<a class=\"close\" ng-click=\"onCancel()\">×</a>\r\n		<h3 class=\"modal-title\">{{title}}</h3>\r\n	</div>\r\n	<div class=\"modal-body\" ng-transclude></div>\r\n	<div class=\"modal-footer\">\r\n		<a ng-click=\"onCancel()\" data-dismiss=\"modal\" class=\"btn\">关闭</a>\r\n		<a ng-click=\"onOk()\" class=\"btn btn-primary\">确定</a>\r\n	</div>\r\n</div>");
$templateCache.put("templates/edit-side-base-structure.html","<div>\r\n	<div ng-dblclick=\"edit(item)\" ng-click=\"getChilds(item)\">{{item.name}}</div>\r\n	<ul ng-if=\"item.type==\'folder\'\" ng-show=\"item.childs\">\r\n		<li ng-repeat=\"item in item.childs|orderBy: \'-type\'\" ng-include=\"\'templates/edit-side-base-structure.html\'\"></li>\r\n	</ul>\r\n</div>");
$templateCache.put("templates/ide-form.html","<div ng-controller=\"IdeCtrl\" class=\"ide-main\">\r\n	<form ng-submit=\"save()\" method=\"post\" accept-charset=\"utf-8\" on-ctrl-s=\"FileModel.save()\">\r\n		<ul class=\"form-header\">\r\n			<li ng-repeat=\"item in FileModel.selects\" ng-click=\"activeTab(item)\" ng-class=\"{active: FileModel.active_tab==item.path}\">{{item.name}} <span class=\"icon-remove\" ng-click=\"FileModel.removeSelect($index)\"></span></li>\r\n		</ul>\r\n		<div class=\'form-main\'>\r\n			<div ui-ace=\"{\r\n				useWrapMode : true,\r\n				showGutter: true,\r\n				theme:\'monokai\',\r\n				mode: FileModel.active_item.code_type,\r\n				onLoad: aceLoaded\r\n			}\" ng-model=\"FileModel.active_item.code\" placeholder=\"代码\"></div>\r\n		</div>\r\n		<div class=\"form-footer\">\r\n			<input class=\"btn btn-primary\" type=\"submit\" value=\"保存\" />\r\n		</div>\r\n	</form>\r\n</div>");
$templateCache.put("templates/ide-sidebar.html","<div ng-controller=\"IdeSidebarCtrl\">\r\n	<div ng-include=\"\'templates/edit-side-base-structure.html\'\"></div>\r\n</div>");
$templateCache.put("templates/navbar.html","<div id=\"webYiHeader\">\r\n	<div id=\"webYiLogo\"><strong>{{app.name}}</strong></div>\r\n	<ul id=\"webYitopNav\" class=\"main-header-nav\">\r\n		<li ng-class=\"{active: app.active==\'home\'}\"><a href=\"#\">首页</a></li>\r\n		<li ng-class=\"{active: app.active==\'appitem\'}\"><a href=\"#appitem\">项目列表</a></li>\r\n		<li ng-class=\"{active: app.active==\'ide\'}\"><a href=\"#ide\">ide</a></li>\r\n	</ul>\r\n</div>");
$templateCache.put("templates/plan-status.html","<div class=\"plan-status-btn-group\">\r\n	<span ng-class=\"{active:status==\'inprogress\'}\" style=\"background:#ff6600\" title=\"进行中\" ng-click=\"setStatus(\'inprogress\')\">.</span>\r\n	<span ng-class=\"{active:status==\'complete\'}\" style=\"background:green\" title=\"完成\" ng-click=\"setStatus(\'complete\')\">.</span>\r\n	<span ng-class=\"{active:status==\'problem\'}\" style=\"background:red\" title=\"有问题\" ng-click=\"setStatus(\'problem\')\">.</span>\r\n</div>");
$templateCache.put("templates/project-sidebar.html","<ul ng-controller=\"ProjectSidebarCtrl\">\r\n	<li class=\"sideber-manage-btn\">\r\n		<span ng-click=\"generateAppItem()\"><i class=\"icon-random\"></i>生成应用</span>\r\n		<span ng-click=\"runAppItem()\"><i class=\"icon-play\"></i>启动应用</span>\r\n		<span ng-click=\"loggerShow()\"><i class=\" icon-eye-close\"></i>控制台</span>\r\n	</li>\r\n	<li>\r\n		<div>\r\n			<span>数据模型管理</span>\r\n			<span class=\"project-sidebar-dir\">/service/models|schemas/</span>\r\n			<a ui-sref=\"schema.create\" class=\"icon-plus sidebar-add-btn\" title=\"添加\"></a>\r\n		</div>\r\n		<ul class=\"\">\r\n			<li class=\"sidebar-item-li\" ng-repeat=\"schema in Schema._models\">\r\n				<a ui-sref=\"schema.update({_id: schema._id})\" class=\"project-sidebar-title\">\r\n					<span>{{schema.model_name}}</span> \r\n					<span class=\"sidebar-item-title\">{{schema.title}}</span>\r\n				</a>\r\n				<div class=\"project-sidebar-li-right\">\r\n					<div plan-status=\"Schema.save(schema)\" ng-model=\"schema.plan_status\"></div>\r\n					<a class=\"icon-minus\" ng-click=\"Schema.delByIndex($index)\" title=\"删除\"></a>\r\n					<a class=\"icon-repeat\" title=\"测试\"></a>\r\n				</div>\r\n			</li>\r\n		</ul>\r\n	</li>\r\n	<li>\r\n		<div>\r\n			<span>URL请求管理</span>\r\n			<span class=\"project-sidebar-dir\">/service/routes.coffee</span>\r\n			<a ui-sref=\"requrl.create\" class=\"icon-plus sidebar-add-btn\" title=\"添加\"></a>\r\n		</div>\r\n		<ul>\r\n			<li class=\"sidebar-item-li\" ng-repeat=\"requrl in Requrl._models\">\r\n				<a ui-sref=\"requrl.update({_id: requrl._id})\" class=\"project-sidebar-title\">\r\n					<span>{{requrl.path}}</span> \r\n					<span class=\"sidebar-item-title\">{{requrl.title}}</span>\r\n				</a>\r\n				<div class=\"project-sidebar-li-right\">\r\n					<div plan-status=\"Requrl.save(requrl)\" ng-model=\"requrl.plan_status\"></div>\r\n					<a class=\"icon-minus\" ng-click=\"Requrl.delByIndex($index)\" title=\"删除\"></a>\r\n					<a class=\"icon-repeat\" title=\"测试\"></a>\r\n				</div>\r\n			</li>\r\n		</ul>\r\n	</li>\r\n	<li>\r\n		<div>\r\n			<span>功能单元管理</span>\r\n			<span class=\"project-sidebar-dir\">/service/actions/</span>\r\n			<a ui-sref=\"action.create\" class=\"icon-plus sidebar-add-btn\" title=\"添加\"></a>\r\n		</div>\r\n		<ul>\r\n			<li class=\"sidebar-item-li\" ng-repeat=\"action in Action._models | orderBy: \'name\'\">\r\n				<a ui-sref=\"action.update({_id: action._id})\" class=\"project-sidebar-title\">\r\n					<span>{{action.name}}</span> \r\n					<span class=\"sidebar-item-title\">{{action.intro}}</span>\r\n				</a>\r\n				<div class=\"project-sidebar-li-right\">\r\n					<div plan-status=\"Action.save(action)\" ng-model=\"action.plan_status\"></div>\r\n					<a class=\"icon-minus\" ng-click=\"Action.delByIndex($index)\" title=\"删除\"></a>\r\n					<a class=\"icon-repeat\" title=\"测试\"></a>\r\n				</div>\r\n			</li>\r\n		</ul>\r\n	</li>\r\n	<li>\r\n		<div>\r\n			<span>代码文件管理</span>\r\n			<span class=\"project-sidebar-dir\">/</span>\r\n			<a ui-sref=\"codefile.create\" class=\"icon-plus sidebar-add-btn\" title=\"添加\"></a>\r\n		</div>\r\n		<ul>\r\n			<li class=\"sidebar-item-li\" ng-repeat=\"codefile in CodeFile._models\">\r\n				<a ui-sref=\"codefile.update({_id: codefile._id})\" class=\"project-sidebar-title\">\r\n					<span>{{codefile.name}}</span> \r\n					<span class=\"sidebar-item-title\">{{codefile.intro}}</span>\r\n				</a>\r\n				<div class=\"project-sidebar-li-right\">\r\n					<div plan-status=\"CodeFile.save(codefile)\" ng-model=\"codefile.plan_status\"></div>\r\n					<a class=\"icon-minus\" ng-click=\"CodeFile.delByIndex($index)\" title=\"删除\"></a>\r\n					<a class=\"icon-repeat\" title=\"测试\"></a>\r\n				</div>\r\n			</li>\r\n		</ul>\r\n	</li>\r\n</ul>");
$templateCache.put("templates/requrl-form.html","<div ng-controller=\"RequrlCtrl\">\r\n	<form ng-submit=\"save()\" on-ctrl-s=\"save()\">\r\n		<ul class=\"form-header\" ng-init=\"show_tab=2\">\r\n			<li ng-click=\"show_tab=1\" ng-class=\"{active: show_tab==1}\">需求配置</li>\r\n			<li ng-click=\"show_tab=2\" ng-class=\"{active: show_tab==2}\">实现代码</li>\r\n			<li ng-click=\"show_tab=3\" ng-class=\"{active: show_tab==3}\">测试代码</li>\r\n		</ul>\r\n		<div class=\"form-main no-code\" ng-if=\"show_tab==1\">\r\n			<div>\r\n				<input ng-model=\"model.title\" type=\"text\" placeholder=\"接口名称\" />\r\n				<input ng-model=\"model.path\" type=\"text\" placeholder=\"接口地址\" />\r\n				<select ng-model=\"model.type\" ng-options=\"type for type in requrl.request_types\"></select>\r\n				<div>\r\n					<textarea ng-model=\"model.intro\" style=\"width:90%\" rows=\"3\" placeholder=\"接口描述\"></textarea>\r\n				</div>\r\n			</div>\r\n\r\n			<h4>HEADER参数</h4>\r\n			<ul>\r\n				<li ng-repeat=\"header in model.headers\">\r\n					<input ng-model=\"header.name\" type=\"text\" placeholder=\"参数名称\" />\r\n					<input ng-model=\"header.value\" type=\"text\" placeholder=\"参数值\" />\r\n					<select ng-model=\"header.value_type\" ng-options=\"value_type for value_type in requrl.value_types\"></select>\r\n					<input ng-model=\"header.intro\" type=\"text\" placeholder=\"参数描述\" />\r\n					<a class=\"btn\" ng-click=\"delParame(\'headers\', $index)\">-</a>\r\n				</li>\r\n				<li><a class=\"btn\" ng-click=\"addParame(\'headers\')\">+增加</a></li>\r\n			</ul>\r\n\r\n			<h4>GET参数</h4>\r\n			<ul>\r\n				<li ng-repeat=\"get in model.gets\">\r\n					<input ng-model=\"get.name\" type=\"text\" placeholder=\"参数名称\" />\r\n					<input ng-model=\"get.value\" type=\"text\" placeholder=\"参数值\" />\r\n					<select ng-model=\"get.value_type\" ng-options=\"value_type for value_type in requrl.value_types\"></select>\r\n					<input ng-model=\"get.intro\" type=\"text\" placeholder=\"参数描述\" />\r\n					<a class=\"btn\" ng-click=\"delParame(\'gets\', $index)\">-</a>\r\n				</li>\r\n				<li><a class=\"btn\" ng-click=\"addParame(\'gets\')\">+增加</a></li>\r\n			</ul>\r\n\r\n			<h4>POST参数</h4>\r\n			<ul>\r\n				<li ng-repeat=\"post in model.posts\">\r\n					<input ng-model=\"post.name\" type=\"text\" placeholder=\"参数名称\" />\r\n					<input ng-model=\"post.value\" type=\"text\" placeholder=\"参数值\" />\r\n					<select ng-model=\"post.value_type\" ng-options=\"value_type for value_type in requrl.value_types\"></select>\r\n					<input ng-model=\"post.intro\" type=\"text\" placeholder=\"参数描述\" />\r\n					<a class=\"btn\" ng-click=\"delParame(\'posts\', $index)\">-</a>\r\n				</li>\r\n				<li><a class=\"btn\" ng-click=\"addParame(\'posts\')\">+增加</a></li>\r\n			</ul>\r\n		</div>\r\n		<div class=\'form-main\' ng-if=\"show_tab==2\">\r\n			<div ui-ace=\"{\r\n				useWrapMode : true,\r\n				showGutter: true,\r\n				theme:\'monokai\',\r\n				mode: \'coffee\',\r\n				onLoad: aceLoaded\r\n			}\" ng-model=\"model.code\" placeholder=\"实现代码\"></div>\r\n		</div>\r\n		<div class=\'form-main\' ng-if=\"show_tab==3\">\r\n			<div ui-ace=\"{\r\n				useWrapMode : true,\r\n				showGutter: true,\r\n				theme:\'monokai\',\r\n				mode: \'coffee\',\r\n				onLoad: aceLoaded\r\n			}\" ng-model=\"model.test_code\" placeholder=\"测试代码\"></div>\r\n		</div>\r\n		<div class=\"form-footer\">\r\n			<input class=\"btn btn-primary\" type=\"submit\" value=\"保存\" />\r\n		</div>\r\n	</form>\r\n</div>\r\n");
$templateCache.put("templates/schema-form.html","<div ng-controller=\"SchemaCtrl\" class=\"schema-main\">\r\n	<form ng-submit=\"save()\" method=\"post\" accept-charset=\"utf-8\" on-ctrl-s=\"save()\">\r\n		<div class=\"form-main no-code\">\r\n			<p>\r\n				模型名称：<input type=\"text\" ng-model=\"schema.model_name\" /> \r\n				表名称：<input type=\"text\" ng-model=\"schema.table_name\" />\r\n				说明：<input type=\"text\" ng-model=\"schema.table_intro\" />\r\n			</p>\r\n			<table class=\"table table-bordered\" width=\"100%\">\r\n				<thead>\r\n					<tr>\r\n						<th width=\"100\">字段名</th>\r\n						<th width=\"100\">字段类型</th>\r\n						<th width=\"100\">可用SCHEMA</th>\r\n						<th width=\"100\">取值范围</th>\r\n						<th width=\"100\">默认值</th>\r\n						<th width=\"100\">描述</th>\r\n						<th width=\"20\">操作</th>\r\n					</tr>\r\n				</thead>\r\n				<tr ng-repeat=\"field in schema.fields\">\r\n					<td><input class=\"td-input\" type=\"text\" ng-model=\"field.name\" /></td>\r\n					<td>\r\n						<select class=\"td-input\" ng-model=\"field.type\" ng-options=\"type for type in field_types\"></select>\r\n					</td>\r\n					<td>\r\n						<select class=\"td-input\" ng-model=\"field.sub_schema\" ng-options=\"sub_schema for sub_schema in schemas\"></select>\r\n					</td>\r\n					<td>\r\n						<div ng-click=\"field.enums_shown=true\">&nbsp;\r\n							[<span ng-repeat=\"_enum in field.enums\">{{_enum.value}},</span>]\r\n						</div>\r\n						<div ng-show=\"field.enums_shown\" class=\"modal\">\r\n							<div class=\"modal-header\">\r\n								<a class=\"close\" ng-click=\"field.enums_shown=false\">×</a>\r\n								<h3 class=\"modal-title\">取值范围</h3>\r\n							</div>\r\n							<div class=\"modal-body\">\r\n								<div>不填默认为任意值</div>\r\n								<ul>\r\n									<li ng-repeat=\"enum in field.enums\">\r\n										<input type=\"text\" ng-model=\"enum.value\" />\r\n										<a class=\"btn\" ng-click=\"delEnum(field, $index)\">-</a>\r\n									</li>\r\n									<li><a class=\"btn\" ng-click=\"addEnum(field)\">+增加</a></li>\r\n								</ul>\r\n							</div>\r\n							<div class=\"modal-footer\">\r\n								<a ng-click=\"field.enums_shown=false\" class=\"btn btn-primary\">确定</a>\r\n							</div>\r\n						</div>\r\n					</td>\r\n					<td><input class=\"td-input\" type=\"text\" ng-model=\"field.default\" /></td>\r\n					<td><input class=\"td-input\" type=\"text\" ng-model=\"field.intro\" /></td>\r\n					<td><a class=\"btn\" title=\"删除\" ng-click=\"delField($index)\">-</a></td>\r\n				</tr>\r\n			</table>\r\n			<a class=\"btn\" ng-click=\"addField()\">+增加字段</a>\r\n			<input class=\"btn btn-primary\" type=\"submit\" value=\"保存\" />\r\n		</div>\r\n	</form>\r\n</div>");}]);
})(window);