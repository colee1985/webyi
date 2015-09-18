var Q, URL, buffer, db, fs, http, iconv;

Q = require('q');

db = require('../utils/MysqlDb');

http = require("http");

buffer = require("buffer");

iconv = require("iconv").Iconv;

URL = require("url");

fs = require('fs');

module.exports = function() {
  return {
    _table_name: 'hot_keywork',
    keywords: [],
    ips: [],
    getAllKeyword: function() {
      var thx;
      thx = this;
      return db.query('select * from ?? where smt_count<=? limit ?', [this._table_name, 0, 10000]).then(function(rows) {
        var obj, _i, _len;
        for (_i = 0, _len = rows.length; _i < _len; _i++) {
          obj = rows[_i];
          thx.keywords.push(obj.keyword);
        }
        return thx.keywords;
      });
    },
    getProxyIps: function() {
      var deferred, thx;
      thx = this;
      deferred = Q.defer();
      fs.readFile('../service/build/utils/ProxyIps.txt', 'utf-8', function(err, data) {
        var ip, ips, res, _i, _len;
        if (err) {
          return deferred.reject('IP文件读取错误');
        } else {
          res = [];
          ips = data.match(/([\d\.]+?):(\d+?)@/ig);
          for (_i = 0, _len = ips.length; _i < _len; _i++) {
            ip = ips[_i];
            res.push(ip.replace('@', '').split(':'));
          }
          thx.ips = res;
          return deferred.resolve(res);
        }
      });
      return deferred.promise;
    },
    run: function() {
      var thx;
      thx = this;
      return Q.all([thx.getProxyIps(), thx.getAllKeyword()]).then(function(res) {
        var i, _i, _results;
        _results = [];
        for (i = _i = 0; _i <= 15; i = ++_i) {
          _results.push(setTimeout(function() {
            return thx._runCirculation();
          }, 500 * i));
        }
        return _results;
      });
    },
    _runCirculation: function() {
      var keyword, thx;
      thx = this;
      console.log('keywords count:', this.keywords.length);
      if (this.keywords.length > 0) {
        keyword = this.keywords[0];
        thx.keywords.splice(0, 1);
        return thx._saveConutToDb(keyword).then(function() {
          console.log('处理成功，还有', thx.keywords.length);
          thx._runCirculation();
          return console.log('继续下一个');
        }, function(err) {
          console.log('存储失败：', err);
          thx.keywords.push(keyword);
          thx._runCirculation();
          return console.log('失败继续下一个');
        });
      } else {
        return console.log('此线程处理完成');
      }
    },
    getCountByKeyword: function(keyword) {
      var thx;
      console.log('at getCountByKeyword');
      thx = this;
      return this.getHtmlByKeyword(keyword).then(function(html) {
        var number;
        html = html.match(/<strong class="search-count">([\s\S]+?)<\/strong>/i);
        if (!html[1]) {
          return thx.getCountByKeyword(keyword);
        }
        number = html[1].replace(/[^\d\.]/ig, '');
        return Number(number);
      });
    },
    getHtmlByKeyword: function(keyword) {
      var deferred, ip, ip_count, ip_index, opt, req, thx, url;
      console.log('GET HTML');
      thx = this;
      console.log('ips:', thx.ips.length);
      ip_count = thx.ips.length;
      ip_index = Math.floor(Math.random() * (ip_count + 1));
      ip = thx.ips[ip_index];
      if (!ip) {
        return this.getHtmlByKeyword(keyword);
      }
      console.log('ip:', ip);
      deferred = Q.defer();
      url = "http://www.aliexpress.com/wholesale?SearchText=" + keyword;
      opt = {
        host: ip[0],
        port: ip[1],
        method: 'GET',
        path: url
      };
      req = http.request(opt, function(res) {
        var html;
        console.log('http res:', res.length);
        html = "";
        res.setEncoding("binary");
        res.on("data", function(chunk) {
          return html += chunk;
        });
        return res.on("end", function() {
          var exception;
          console.log('http end:', html.length);
          try {
            html = (new iconv("GBK", "UTF-8")).convert(new Buffer(html, "binary")).toString();
            console.log('end html.length', html.length);
            return deferred.resolve(html);
          } catch (_error) {
            exception = _error;
            return deferred.reject(exception);
          }
        });
      });
      req.on('error', function(err) {
        console.log('请求异常：', err);
        return deferred.reject(err);
      });
      req.end();
      return deferred.promise;
    },
    _saveConutToDb: function(keyword) {
      var table_name;
      console.log('keyword:', keyword);
      table_name = this._table_name;
      return this.getCountByKeyword(keyword).then(function(number) {
        if (number < 1) {
          number = 1;
        }
        return db.query('update ?? set smt_count=? where keyword=?', [table_name, number, keyword]).then(function(res) {
          console.log('update db:', number, keyword, res);
          return res;
        });
      });
    }
  };
};
