(function(window){
"use strict"
var ag;

ag = angular.module("WebYi", ['ui.router', 'pascalprecht.translate']);

ag.config([
  '$locationProvider', '$translateProvider', '$urlRouterProvider', function($locationProvider, $translateProvider, $urlRouterProvider) {
    var lang;
    lang = "en";
    $translateProvider.preferredLanguage(lang);
    return $urlRouterProvider.otherwise('/site/index');
  }
]);

ag.run([
  '$rootScope', 'navbar', 'layout', function($rootScope, navbar, layout) {
    $rootScope.styles = ['vender/angular/angular-carousel.min.css', 'vender/bootstrap/v2.3.2/css/bootstrap.min.css', 'vender/bootstrap/v2.3.2/css/bootstrap-responsive.min.css', 'css/app.css'];
    console.log(navbar);
    return $rootScope.bn = navbar;
  }
]);

ag.run(function() {
  return $(document.body).append('<div debug-tool></div>');
});

var API_DOMAIN, IMG_DOMAIN;

API_DOMAIN = 'http://dev.www.waimaice.com/api/';

IMG_DOMAIN = 'http://dev.img.uiyun.com/1000/';

ag.config([
  '$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('member', {
      url: "/member",
      views: {
        "container": {
          templateUrl: "templates/member/layout.html",
          controller: "memberLayout"
        }
      }
    });
    return $urlRouterProvider.otherwise('/member/home');
  }
]);

ag.config([
  '$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('site', {
      url: '/site',
      views: {
        "container": {
          templateUrl: "templates/site/main.html",
          controller: siteCtrl
        }
      }
    });
    $stateProvider.state('site.index', {
      url: '/index/:item_id',
      views: {
        "site-container": {
          templateUrl: "templates/site/index.html",
          controller: indexCtrl
        }
      }
    });
    return $urlRouterProvider.otherwise('/site/index/0');
  }
]);

ag.directive('debugTool', [
  "$rootScope", "loginInfo", function($rootScope, loginInfo) {
    return {
      restrict: "AE",
      templateUrl: 'templates/debug/debug-tool.html',
      replace: true,
      scope: true,
      link: function(scope, element, attrs) {
        scope.isShown = window.localStorage.debugToolIsShown;
        scope.$watch("isShown", function(n, o) {
          return window.localStorage.debugToolIsShown = n;
        });
        scope.loginInfo = loginInfo;
        scope.debug = {
          url: window.location.href
        };
        return $(element).find('#wmcDebugBtn').css({
          position: 'fixed',
          right: 0,
          bottom: 0,
          zIndex: 100000,
          background: '#333',
          color: '#fff',
          padding: '5px 10px',
          cursor: 'pointer'
        });
      }
    };
  }
]);

ag.directive("layout", [
  function() {
    return {
      priority: 0,
      templateUrl: "templates/layouts/layout.html",
      replace: true,
      restrict: "AE",
      scope: true
    };
  }
]);

ag.directive("addCollectBtn", [
  'MemberCollect', function(MemberCollect) {
    return {
      priority: 0,
      restrict: "AE",
      scope: {
        leaflet_id: '@addCollectBtn'
      },
      link: function(scope, element) {
        return $(element).click(function() {
          return MemberCollect.add(scope.leaflet_id);
        });
      }
    };
  }
]);

ag.directive("loginInfoDropdown", [
  'loginInfo', function(loginInfo) {
    return {
      priority: 0,
      templateUrl: "templates/member/login-info-dropdown.html",
      replace: true,
      transclude: true,
      restrict: "A",
      scope: true,
      link: function(scope, element) {
        return scope.loginInfo = loginInfo;
      }
    };
  }
]);

ag.directive("loginModal", [
  'loginInfo', '$http', 'toast', function(loginInfo, $http, toast) {
    return {
      priority: 0,
      templateUrl: "templates/member/login-modal.html",
      replace: true,
      transclude: true,
      restrict: "A",
      scope: {
        title: "@",
        onOk: "&",
        onCancel: "&",
        visible: "@"
      },
      link: function(scope, element) {
        scope.loginInfo = loginInfo;
        return scope.logging = function() {
          var LoginForm;
          console.log(this);
          LoginForm = {
            username: scope.nickname,
            password: scope.password,
            rememberMe: scope.rememberMe
          };
          return $http({
            method: 'POST',
            headers: {
              'Accept': '*/*',
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            url: loginInfo.authByUrl,
            data: $.param({
              LoginForm: LoginForm
            })
          }).success((function(_this) {
            return function(data) {
              return toast.show('登录成功');
            };
          })(this)).error(function(data, status, headers, config) {
            toast.show('登录失败');
            return scope.errorMsg = data.message;
          });
        };
      }
    };
  }
]);

ag.directive("loginModalBtn", [
  'loginInfo', function(loginInfo) {
    return {
      restrict: "A",
      scope: {
        loginModalBtn: "@"
      },
      link: function(scope, element) {
        return element.bind('click', function() {
          loginInfo.modalShow = true;
          return scope.$apply();
        });
      }
    };
  }
]);

ag.directive("qqLoginBtn", [
  'loginInfo', function(loginInfo) {
    return {
      priority: 0,
      template: '<img ng-src="{{iconUrl}}"/>',
      restrict: "AE",
      scope: true,
      link: function(scope, element) {
        scope.iconUrl = 'http://qzonestyle.gtimg.cn/qzone/vas/opensns/res/img/Connect_logo_3.png';
        return $(element).bind('click', function() {
          var url;
          url = loginInfo.qqLoginUrl;
          return window.open(url, "weiboWindow", "height=480, width=650, top=10, left=" + ((window.screen.availWidth - 600) / 2) + ", toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no");
        });
      }
    };
  }
]);

ag.directive('registerModal', [
  'loginInfo', '$http', 'toast', function(loginInfo, $http, toast) {
    return {
      priority: 0,
      templateUrl: "templates/member/register-modal.html",
      replace: true,
      transclude: true,
      restrict: "AE",
      scope: {
        title: "@",
        onOk: "&",
        onCancel: "&",
        visible: "@"
      },
      link: function(scope, element) {
        scope.loginInfo = loginInfo;
        return scope.register = function() {
          var User;
          User = {
            username: scope.nickname,
            password: scope.password,
            rememberMe: scope.rememberMe
          };
          return $http({
            method: 'POST',
            headers: {
              'Accept': '*/*',
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            url: loginInfo.authByUrl,
            data: $.param({
              User: User
            })
          }).success((function(_this) {
            return function(data) {
              return toast.show('登录成功');
            };
          })(this)).error(function(data, status, headers, config) {
            toast.show('登录失败');
            return scope.errorMsg = data.message;
          });
        };
      }
    };
  }
]);

var factory;

ag.directive("dialog", factory = function() {
  return {
    priority: 100,
    templateUrl: "templates/modal.html",
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

jQuery.fn.extend({
  QYtable: function(config) {
    var filterBody, getData, init, loading, page, refreshContent, setFilter, setFoot, setHead, table, tbody, tfoot, thead, wrap, _ref, _ref1;
    config = config || {};
    config.models = (_ref = config.models) != null ? _ref : {};
    page = 1;
    wrap = $('<div>').appendTo(this).css('position', 'relative');
    loading = (_ref1 = config.loading) != null ? _ref1 : $('<div>').appendTo(wrap).html('<div style="padding-top:30px;color:#fff">……LOADING……</div>').css({
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 1000,
      opacity: 0.5,
      background: '#000',
      textAlign: 'center',
      fontSize: 30
    });
    table = $('<table>').appendTo(wrap).attr({
      id: config.id,
      "class": config.className || 'qy-table',
      style: config.style,
      width: config.width || '100%'
    });
    thead = $('<thead class="qy-table-thead">').appendTo(table);
    filterBody = $('<tbody class="qy-table-filter">').appendTo(table);
    tbody = $('<tbody class="qy-table-tbody">').appendTo(table);
    tfoot = $('<tfoot class="qy-table-tfoot">').appendTo(table);
    getData = function(fn) {
      loading.show();
      if (!config.url) {
        return fn();
      }
      return $.ajax({
        url: config.url,
        type: 'get',
        data: config.post_data + '&page=' + page,
        dataType: 'json',
        success: function(data) {
          config.models = data.datas;
          config.pages = data.pages;
          return fn();
        },
        error: function(request, textStatus, errorThrown) {
          console.log(request);
          loading.hide();
          return $('<div>').css({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1000,
            background: '#fff'
          }).html(function() {
            return '<h1>' + request.statusText + request.status + '</h1>' + request.responseText;
          }).appendTo(wrap);
        }
      });
    };
    setHead = function() {
      var columns, models;
      if (typeof config.columns === 'undefined') {
        getData();
        columns = {};
        models = config.models;
        $.each(models[0], function(key, val) {
          return columns[key] = key;
        });
        config.columns = columns;
      }
      return $.each(config.columns, function(key, val) {
        var str, th, width;
        str = val.header || val;
        width = val.width || '';
        th = $('<th>' + str + '</th>').attr('width', width);
        return thead.append(th);
      });
    };
    setFilter = function() {
      if (config.useFilter) {
        return $.each(config.columns, function(index, val) {
          var filter, input, select_name, td;
          filter = val.filter || {};
          input = $('<input>');
          if (filter.type === 'dropdown' && filter.values) {
            select_name = (filter.name || val.name) || index;
            if (config.useFilter !== true) {
              select_name = config.useFilter + '[' + select_name + ']';
            }
            input = $('<select>').attr('name', select_name);
            $.each(filter.values, function(key, val) {
              var selected;
              selected = '';
              if (filter.selected === key) {
                selected = 'selected="true"';
              }
              return input.append('<option ' + selected + ' value="' + key + '">' + val + '</option>');
            });
          } else {
            if (!filter.name) {
              filter.name = val.name || val;
            }
            if (config.useFilter !== true) {
              filter.name = config.useFilter + '[' + filter.name + ']';
            }
            if (!filter.type) {
              filter.type = 'text';
            }
            if (!filter.placeholder) {
              filter.placeholder = val.name || val;
            }
            $(input).attr(filter);
          }
          td = $('<td>').append(input);
          filterBody.append(td);
          return $(input).bind('change', function() {
            return refreshContent();
          });
        });
      }
    };
    refreshContent = function() {
      config.post_data = $(filterBody).find('input,select').serialize();
      return getData(function() {
        tbody.html('');
        $.each(config.models, function(index, val) {
          var tr;
          tr = $('<tr>');
          $.each(config.columns, function(index, v) {
            var field, td, value;
            field = v.name || v;
            value = val[field];
            td = $('<td>').appendTo(tr);
            if (v.value) {
              value = v.value(val);
            }
            td.html(value);
            if (v.process) {
              return v.process.call(td, val);
            }
          });
          return tbody.append(tr);
        });
        setFoot();
        return loading.fadeOut('fast');
      });
    };
    setFoot = function() {
      var foot_td, i, li, pageCount, ul, _i;
      tfoot.html('');
      if (config.pages && config.pages.pageCount > 1) {
        page = config.pages.page || 1;
        pageCount = config.pages.pageCount;
        foot_td = $('<td>').attr('colspan', config.columns.length).appendTo(tfoot);
        ul = $('<ul>').addClass('table-pages btn-group').appendTo(foot_td);
        for (i = _i = 1; 1 <= pageCount ? _i <= pageCount : _i >= pageCount; i = 1 <= pageCount ? ++_i : --_i) {
          li = $('<li>').addClass('btn').attr('data', i).html(i).appendTo(ul);
          if (i === page) {
            li.addClass('active');
          }
        }
        return ul.find('li').click(function() {
          page = $(this).attr('data');
          refreshContent();
          ul.find('li').removeClass('active');
          return $(this).addClass('active');
        });
      }
    };
    init = (function(_this) {
      return function() {
        setHead();
        setFilter();
        refreshContent();
        return $(_this).append(wrap);
      };
    })(this);
    return init();
  }
});


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
    background: '#000',
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
        console.log(linking_number, 'by GlobalLoading');
        if (linking_number < 1) {
          return el.hide();
        }
      };
    })(this)
  };
});


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

ag.factory('layout', function() {
  $(document.body).append('<div layout></div>');
  return {
    show: false
  };
});

ag.provider('loginInfo', function() {
  return {
    modalShow: false,
    isGuest: true,
    nickname: '游客',
    user_id: 0,
    authByUrl: API_DOMAIN + 'user/login',
    $get: [
      "$http", function($http) {
        var ths;
        ths = this;
        return this;
      }
    ]
  };
});

ag.provider('MemberCollect', {
  list_url: API_DOMAIN + 'collect/list',
  add_url: API_DOMAIN + 'collect/add',
  del_url: API_DOMAIN + 'collect/del',
  $get: [
    "loginInfo", "toast", "$q", "GlobalLoading", function(loginInfo, toast, $q, GlobalLoading) {
      return {
        models: {},
        add: (function(_this) {
          return function(leaflet_id) {
            GlobalLoading.show();
            return $.ajax({
              type: 'post',
              url: _this.add_url,
              data: {
                leaflet_id: leaflet_id,
                user_id: loginInfo.user_id
              },
              success: function() {
                toast.show('收藏成功');
                return GlobalLoading.hide();
              },
              error: function(res) {
                toast.show('收藏失败');
                GlobalLoading.hide();
                return console.log(res);
              }
            });
          };
        })(this),
        getList: (function(_this) {
          return function() {
            var deferred;
            GlobalLoading.show();
            deferred = $q.defer();
            $.ajax({
              type: 'GET',
              url: _this.list_url,
              dataType: 'json',
              data: {
                user_id: loginInfo.user_id
              },
              success: function(data) {
                deferred.resolve(data);
                return GlobalLoading.hide();
              },
              error: function(res) {
                deferred.reject(res);
                return GlobalLoading.hide();
              }
            });
            return deferred.promise;
          };
        })(this),
        del: (function(_this) {
          return function(leaflet_id) {
            GlobalLoading.show();
            return $.ajax({
              type: 'post',
              url: _this.del_url,
              data: {
                leaflet_id: leaflet_id,
                user_id: loginInfo.user_id
              },
              success: function() {
                toast.show('删除成功');
                return GlobalLoading.hide();
              },
              error: function(res) {
                toast.show('删除失败');
                GlobalLoading.hide();
                return console.log(res);
              }
            });
          };
        })(this)
      };
    }
  ]
});

ag.factory('navbar', function() {
  return {
    active: 'site',
    app_name: 'WebYi',
    pageTitle: 'WebYi'
  };
});

ag.controller('memberLayout', [
  "$scope", "navbar", function($scope, navbar) {
    navbar.pageTitle = '个人中心';
    navbar.active = "member";
    return console.log('member');
  }
]);

var indexCtrl;

indexCtrl = [
  "$scope", "$stateParams", "$state", function($scope, $stateParams, $state) {
    return console.log($stateParams);
  }
];

var siteCtrl;

siteCtrl = [
  "$scope", "$http", "$rootScope", "$stateParams", "$state", function($scope, $http, $rootScope, $stateParams, $state) {
    $scope.items = [
      {
        id: 1,
        name: 'WMC'
      }, {
        id: 2,
        name: 'KT'
      }
    ];
    $scope.animation = '';
    return $scope.select = function() {
      console.log('click item');
      return $scope.animation = 'animation done';
    };
  }
];

angular.module("WebYi").run(["$templateCache", function($templateCache) {$templateCache.put("templates/api/form.html","<form>\r\n	<div>\r\n		<input name=\"Api[name]\" type=\"text\" placeholder=\"接口名称\" />\r\n		<input name=\"Api[item_id]\" type=\"text\" placeholder=\"接口所属项目ID\" />\r\n		<input name=\"Api[description]\" type=\"text\" placeholder=\"接口描述\" />\r\n		<input name=\"Api[api_code]\" type=\"text\" placeholder=\"接口编号\" />\r\n	</div>\r\n	<div>\r\n		<input name=\"Api[address]\" type=\"text\" placeholder=\"接口地址\" />\r\n		<select name=\"Api[type]\">\r\n			<option value=\"GET\" selected=\"\">GET</option>\r\n			<option value=\"POST\">POST</option>\r\n			<option value=\"PUT\">PUT</option>\r\n			<option value=\"PATCH\">PATCH</option>\r\n			<option value=\"DELETE\">DELETE</option>\r\n			<option value=\"COPY\">COPY</option>\r\n			<option value=\"HEAD\">HEAD</option>\r\n			<option value=\"OPTIONS\">OPTIONS</option>\r\n			<option value=\"LINK\">LINK</option>\r\n			<option value=\"UNLINK\">UNLINK</option>\r\n			<option value=\"PURGE\">PURGE</option>\r\n		</select>\r\n	</div>\r\n\r\n	<h3>HEADER参数</h3>\r\n	<ul>\r\n		<li>\r\n			<input name=\"ApiParam[name]\" type=\"text\" placeholder=\"参数名称\" />\r\n			<input name=\"ApiParam[value]\" type=\"text\" placeholder=\"参数值\" />\r\n			<select name=\"ApiParam[value_type]\">\r\n				<option value=\"TEXT\" selected=\"\">TEXT</option>\r\n				<option value=\"EXPRESS\">EXPRESS</option>\r\n			</select>\r\n			<input name=\"ApiParam[description]\" type=\"text\" placeholder=\"参数描述\" />\r\n			<input name=\"ApiParam[type]\" type=\"hidden\" value=\"HEADER\" />\r\n		</li>\r\n	</ul>\r\n\r\n	<h3>GET参数</h3>\r\n	<ul>\r\n		<li>\r\n			<input name=\"ApiParam[name]\" type=\"text\" placeholder=\"参数名称\" />\r\n			<input name=\"ApiParam[value]\" type=\"text\" placeholder=\"参数值\" />\r\n			<select name=\"ApiParam[value_type]\">\r\n				<option value=\"TEXT\" selected=\"\">TEXT</option>\r\n				<option value=\"EXPRESS\">EXPRESS</option>\r\n			</select>\r\n			<input name=\"ApiParam[description]\" type=\"text\" placeholder=\"参数描述\" />\r\n			<input name=\"ApiParam[type]\" type=\"hidden\" value=\"HEADER\" />\r\n		</li>\r\n	</ul>\r\n\r\n	<h3>POST参数</h3>\r\n	<ul>\r\n		<li>\r\n			<input name=\"ApiParam[name]\" type=\"text\" placeholder=\"参数名称\" />\r\n			<input name=\"ApiParam[value]\" type=\"text\" placeholder=\"参数值\" />\r\n			<select name=\"ApiParam[value_type]\">\r\n				<option value=\"TEXT\" selected=\"\">TEXT</option>\r\n				<option value=\"FILE\">FILE</option>\r\n				<option value=\"EXPRESS\">EXPRESS</option>\r\n			</select>\r\n			<input name=\"ApiParam[description]\" type=\"text\" placeholder=\"参数描述\" />\r\n			<input name=\"ApiParam[type]\" type=\"hidden\" value=\"HEADER\" />\r\n		</li>\r\n		<li>\r\n			<input name=\"ApiParam[name]\" type=\"text\" placeholder=\"参数名称\" />\r\n			<input name=\"ApiParam[value]\" type=\"text\" placeholder=\"参数值\" />\r\n			<select name=\"ApiParam[value_type]\">\r\n				<option value=\"TEXT\" selected=\"\">TEXT</option>\r\n				<option value=\"FILE\">FILE</option>\r\n				<option value=\"EXPRESS\">EXPRESS</option>\r\n			</select>\r\n			<input name=\"ApiParam[description]\" type=\"text\" placeholder=\"参数描述\" />\r\n			<input name=\"ApiParam[type]\" type=\"hidden\" value=\"HEADER\" />\r\n		</li>\r\n	</ul>\r\n</form>\r\n");
$templateCache.put("templates/debug/debug-tool.html","<div id=\"debugContainer\">\r\n	<a id=\"wmcDebugBtn\" ng-click=\"isShown=!isShown\">DEBUG</a>\r\n	<div id=\"wmcDebugBody\" ng-if=\"isShown\">\r\n		<div iscroll=\"debugTool\" h-scroll=\"false\" class=\"debug-main\">\r\n			<div>\r\n				<input kt-Go-Back type=\"button\" value=\"返回\"/>\r\n			</div>\r\n			<div>\r\n				登录：\r\n				<input id=\"loginInfo_1\" type=\"radio\" ng-model=\"loginInfo.isGuest\" ng-value=\"true\">\r\n				<label for=\"loginInfo_1\">游客</label>\r\n				<input id=\"loginInfo_0\" type=\"radio\" ng-model=\"loginInfo.isGuest\" ng-value=\"false\">\r\n				<label for=\"loginInfo_0\">已登录</label>\r\n				{{loginInfo.isGuest}}\r\n			</div>\r\n			<div>\r\n				<div>\r\n					设备DEBUG URL:\r\n				</div>\r\n				<textarea ng-model=\"debug.url\" cols=\"60\" rows=\"5\"></textarea>\r\n			</div>\r\n		</div>\r\n		<div class=\"background-layer\"></div>\r\n	</div>\r\n</div>");
$templateCache.put("templates/layouts/layout.html","<div id=\"appLayout\">\r\n	<div \r\n		id=\"appContainer\"\r\n		ng-class=\"position\"\r\n		ui-view=\"container\"\r\n	></div>\r\n\r\n	<div login-modal></div>\r\n	<div register-modal></div>\r\n</div>");
$templateCache.put("templates/member/home.html","<h1 class=\"member-my-collect-title\">我的收藏</h1>\r\n<ul class=\"member-collect-list\">\r\n	<li class=\"collect-item\"\r\n		ng-repeat=\"model in MemberCollect.models\"\r\n	>\r\n		<a href=\"#/leaflet/detail/{{model.id}}\"> \r\n			<img \r\n			ng-src=\"{{model.images[0]}}\" \r\n			title=\"{{model.distance}}\" />\r\n			<span class=\"leaflet-name\">{{$index}}:{{model.name}}</span>\r\n		</a>\r\n		<div ng-click=\"del($index, model.id)\" class=\"del-collect-btn\">\r\n			<span class=\"icon-remove\"></span>\r\n		</div>\r\n	</li>\r\n</ul>\r\n<div style=\"clear:both\"></div>");
$templateCache.put("templates/member/layout.html","<div id=\"memberContaier\">\r\n	<div ui-view=\"memberSidebar\" id=\"memberSidebar\">\r\n		<ul>\r\n			<li><a href=\"#/member/home\">我的收藏</a></li>\r\n			<li><a href=\"#/member/leaflets\">我的上传</a></li>\r\n			<li><a >修改密码</a></li>\r\n		</ul>\r\n	</div>\r\n	<div ui-view=\"memberBody\" id=\"memberBody\">\r\n	\r\n	</div>\r\n</div>\r\n");
$templateCache.put("templates/member/leaflets.html","<h1 class=\"member-my-collect-title\">我的上传</h1>\r\n<ul class=\"member-collect-list\">\r\n	<li class=\"collect-item\"\r\n		ng-repeat=\"model in MemberLeaflet.models\"\r\n	>\r\n		<a href=\"#/leaflet/detail/{{model.id}}\"> \r\n			<img \r\n			ng-src=\"{{model.images[0]}}\" \r\n			title=\"{{model.distance}}\" />\r\n			<p class=\"leaflet-name\">{{$index}}:{{model.name}}</p>\r\n		</a>\r\n		<div ng-click=\"del($index, model.id)\" class=\"del-collect-btn\">\r\n			<span class=\"icon-remove\"></span>\r\n		</div>\r\n	</li>\r\n</ul>\r\n<div style=\"clear:both\"></div>");
$templateCache.put("templates/member/login-info-dropdown.html","<ul id=\"userInfoBox\" class=\"nav pull-right\">\r\n	<li class=\"dropdown\" ng-if=\"!loginInfo.isGuest\">\r\n		<a class=\"dropdown-toggle\" data-toggle=\"dropdown\">{{loginInfo.nickname}}<b class=\"caret\"></b></a>\r\n		<ul class=\"dropdown-menu\">\r\n			<li><a href=\"#/member/home\">个人中心</a></li>\r\n			<li><a upload-leaflet-btn>上传菜单</a></li>\r\n			<li><a href=\"/site/logout\">退出登录</a></li> \r\n		</ul>\r\n	</li>\r\n	<li class=\"dropdown\" ng-if=\"loginInfo.isGuest\">\r\n		<a class=\"dropdown-toggle\" data-toggle=\"dropdown\">登录<b class=\"caret\"></b></a>\r\n		<ul class=\"dropdown-menu\">\r\n			<li><a qq-Login-Btn></a></li>\r\n			<li><a><img id=\"wmcSinaLoginBtn\" src=\"http://www.sinaimg.cn/blog/developer/wiki/240.png\"/></a></li>\r\n			<li class=\"divider\"></li>\r\n			<li><a target=\"_blank\" href=\"http://wpa.qq.com/msgrd?v=3&uin=5969226&site=qq&menu=yes\">\r\n				<img border=\"0\" src=\"http://wpa.qq.com/pa?p=2:5969226:42\" alt=\"联系站长\" title=\"联系站长\">\r\n			</a></li>\r\n			<li login-modal-btn><a>账号登录</a></li>\r\n			<li register-modal-btn><a>注册新账号</a></li>\r\n		</ul>\r\n	</li>\r\n</ul>");
$templateCache.put("templates/member/login-modal.html","<div id=\"WMCloginModal\" class=\"modal\" ng-show=\"loginInfo.modalShow\">\r\n	<div class=\"modal-header\">\r\n		<a class=\"close\" ng-click=\"loginInfo.modalShow=false\">×</a>\r\n		<h3 class=\"modal-title\">用户登录 {{loginInfo.password}}</h3>\r\n	</div>\r\n	<form id=\"loginForm\" name=\"loginForm\" ng-submit=\"logging()\">\r\n		<div class=\"error-msg\" ng-bind=\"errorMsg\"></div>\r\n		<div>账号：<input name=\"username\" type=\"text\" ng-model=\"nickname\" /></div>\r\n		<div>密码：<input name=\"password\" type=\"password\" ng-model=\"password\" /></div>\r\n		<div style=\"padding-left:40px\">\r\n			<input id=\"rememberMe\" name=\"rememberMe\" type=\"checkbox\" ng-model=\"rememberMe\" />\r\n			<label for=\"rememberMe\">\r\n				记住账号\r\n			</label>\r\n			<input style=\"margin-left:70px\" class=\"btn\" type=\"submit\" value=\"登录\"/>\r\n		</div>\r\n	</form>\r\n</div>");
$templateCache.put("templates/member/register-modal.html","<div class=\"modal\" ng-show=\"isShown\">\r\n	<div class=\"modal-header\">\r\n		<a class=\"close\" ng-click=\"loginInfo.modalShow=false\">×</a>\r\n		<h3 class=\"modal-title\">用户登录 {{loginInfo.password}}</h3>\r\n	</div>\r\n	<form name=\"loginForm\" ng-submit=\"logging()\">\r\n		<div class=\"error-msg\" ng-bind=\"errorMsg\"></div>\r\n		<div>账号：<input name=\"username\" type=\"text\" ng-model=\"nickname\" /></div>\r\n		<div>密码：<input name=\"password\" type=\"password\" ng-model=\"password\" /></div>\r\n		<div style=\"padding-left:40px\">\r\n			<input id=\"rememberMe\" name=\"rememberMe\" type=\"checkbox\" ng-model=\"rememberMe\" />\r\n			<label for=\"rememberMe\">\r\n				记住账号\r\n			</label>\r\n			<input style=\"margin-left:70px\" class=\"btn\" type=\"submit\" value=\"登录\"/>\r\n		</div>\r\n	</form>\r\n</div>");
$templateCache.put("templates/modal/dialog.html","<div ng-show=\"visible\" class=\"modal\">\r\n	<div class=\"modal-header\">\r\n		<a class=\"close\" ng-click=\"onCancel()\">×</a>\r\n		<h3 class=\"modal-title\">{{title}}</h3>\r\n	</div>\r\n	<div class=\"modal-body\" ng-transclude></div>\r\n	<div class=\"modal-footer\">\r\n		<a ng-click=\"onCancel()\" data-dismiss=\"modal\" href=\"#\" class=\"btn\">关闭</a>\r\n		<a ng-click=\"onOk()\" href=\"#\" class=\"btn btn-primary\">确定</a>\r\n	</div>\r\n</div>");
$templateCache.put("templates/site/index.html","<div id=\"siteIndexContainer\">\r\n	<div class=\"btn-group\" data-toggle=\"buttons-radio\">\r\n		<button class=\"btn\">开发环境选择：</button>\r\n		<button class=\"btn\">DEV</button>\r\n		<button class=\"btn\">STG</button>\r\n		<button class=\"btn\">PRO</button>\r\n	</div>\r\n	<form action=\"\" method=\"get\" accept-charset=\"utf-8\">\r\n		<div id=\"request-url-container\">\r\n            <input type=\"text\" name=\"url\" placeholder=\"Enter request URL here\"/>\r\n            <select id=\"request-method-selector\">\r\n                <option value=\"GET\" selected=\"\">GET</option>\r\n                <option value=\"POST\">POST</option>\r\n                <option value=\"PUT\">PUT</option>\r\n                <option value=\"PATCH\">PATCH</option>\r\n                <option value=\"DELETE\">DELETE</option>\r\n                <option value=\"COPY\">COPY</option>\r\n                <option value=\"HEAD\">HEAD</option>\r\n                <option value=\"OPTIONS\">OPTIONS</option>\r\n                <option value=\"LINK\">LINK</option>\r\n                <option value=\"UNLINK\">UNLINK</option>\r\n                <option value=\"PURGE\">PURGE</option>\r\n            </select>\r\n            <button class=\"btn\" id=\"url-keyvaleditor-actions-open\"><i class=\"icon-edit\"></i> URL params</button>\r\n            <button class=\"btn\" id=\"headers-keyvaleditor-actions-open\"><i class=\"icon-edit\"></i> Headers (<span class=\"headers-count\">0</span>)</button>\r\n        </div>\r\n\r\n        <div id=\"url-keyvaleditor\">\r\n        	<div class=\"keyvalueeditor-row\">\r\n        		<input type=\"text\" class=\"keyvalueeditor-key\" placeholder=\"URL Parameter Key\" name=\"keyvalueeditor-key\" \"=\"\"><input type=\"text\" class=\"keyvalueeditor-value keyvalueeditor-value-text\" placeholder=\"Value\" name=\"keyvalueeditor-value\" \"=\"\"/>\r\n        		<a tabindex=\"-1\" class=\"keyvalueeditor-delete\">\r\n        			<img class=\"deleteButton\" src=\"images/delete.png\"/>\r\n        		</a>\r\n        	</div>\r\n        	<div class=\"keyvalueeditor-row keyvalueeditor-last\">\r\n        		<input type=\"text\" class=\"keyvalueeditor-key\" placeholder=\"URL Parameter Key\" name=\"keyvalueeditor-key\" \"=\"\"><input type=\"text\" class=\"keyvalueeditor-value keyvalueeditor-value-text\" placeholder=\"Value\" name=\"keyvalueeditor-value\" \"=\"\"/>\r\n        	</div>\r\n        </div>\r\n\r\n        <div id=\"data-mode-selector\" class=\"btn-group clearfix\" data-toggle=\"buttons-radio\">\r\n            <a class=\"btn active\" data-mode=\"params\">form-data</a>\r\n            <a class=\"btn\" data-mode=\"urlencoded\">x-www-form-urlencoded</a>\r\n            <a class=\"btn\" data-mode=\"raw\">raw</a>\r\n        </div>\r\n\r\n        <div id=\"formdata-keyvaleditor\">\r\n        	<div class=\"keyvalueeditor-row\">\r\n        		<input type=\"text\" class=\"keyvalueeditor-key\" placeholder=\"Key\" name=\"keyvalueeditor-key\" \"=\"\"><input type=\"text\" class=\"keyvalueeditor-value keyvalueeditor-value-text\" placeholder=\"Value\" name=\"keyvalueeditor-value\" \"=\"\">\r\n        		<input type=\"file\" multiple=\"\" class=\"keyvalueeditor-value keyvalueeditor-value-file\" placeholder=\"Value\" name=\"keyvalueeditor-value\" value=\"\" style=\"display: none;\">\r\n        		<select class=\"keyvalueeditor-valueTypeSelector\">\r\n        			<option value=\"text\" selected=\"\">Text</option>\r\n        			<option value=\"file\">File</option>\r\n        		</select>\r\n        		<a tabindex=\"-1\" class=\"keyvalueeditor-delete\">\r\n        			<img class=\"deleteButton\" src=\"images/delete.png\">\r\n        		</a>\r\n        	</div>\r\n        	<div class=\"keyvalueeditor-row keyvalueeditor-last\">\r\n        		<input type=\"text\" class=\"keyvalueeditor-key\" placeholder=\"Key\" name=\"keyvalueeditor-key\" \"=\"\"><input type=\"text\" class=\"keyvalueeditor-value keyvalueeditor-value-text\" placeholder=\"Value\" name=\"keyvalueeditor-value\" \"=\"\">\r\n        		<input type=\"file\" multiple=\"\" class=\"keyvalueeditor-value keyvalueeditor-value-file\" placeholder=\"Value\" name=\"keyvalueeditor-value\" value=\"\" style=\"display: none;\">\r\n        		<select class=\"keyvalueeditor-valueTypeSelector\">\r\n        			<option value=\"text\" selected=\"\">Text</option>\r\n        			<option value=\"file\">File</option>\r\n        		</select>\r\n        	</div>\r\n        </div>\r\n\r\n        <div id=\"request-actions-primary\">\r\n	        <button class=\"btn btn-primary\" data-loading-text=\"Fetching data...\" type=\"button\" data-complete-text=\"Send request\" id=\"submit-request\" tabindex=\"5\">\r\n	            Send\r\n	        </button>\r\n	        <button class=\"btn\" id=\"update-request-in-collection\">Save</button>\r\n	        <button class=\"btn\" id=\"add-to-collection\" href=\"#modal-add-to-collection\" data-toggle=\"modal\" data-backdrop=\"static\" data-keyboard=\"true\">Add to project\r\n	        </button>\r\n	    </div>\r\n	</form>\r\n</div>");
$templateCache.put("templates/site/main.html","<div id=\"siteSidebar\">\r\n	<div class=\"main-box {{animation}}\">\r\n		<ul class=\"nav item-list\">\r\n			<li ng-click=\"select()\" ng-repeat=\"item in items\">\r\n				<a ui-sref=\"site.index({item_id:item.id})\"><i class=\"icon-chevron-right\"></i>{{item.name}}</a>\r\n			</li>\r\n		</ul>\r\n		<ul class=\"api-list\">\r\n			<li>登录接口</li>\r\n			<li>注册接口</li>\r\n		</ul>\r\n	</div>\r\n</div>\r\n<div id=\"siteContainer\" ui-view=\"site-container\"></div>");}]);
})(window);