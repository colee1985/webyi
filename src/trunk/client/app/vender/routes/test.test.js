var Q, domain, log4js, request;

require("should");

Q = require('q');

log4js = require('log4js');

request = require('request');

domain = 'http://127.0.0.1:1081';

describe("test 功能测试", function() {
  return it('Requrl test', function(done) {
    return request.get({
      url: domain + '/test',
      qs: {
        "": ""
      }
    }, function(error, response, body) {
      if (error) {
        done(error);
        console.log(error);
      }
      if (!error && response.statusCode === 200) {
        console.log(body);
        return done();
      } else {
        done();
        return console.log(body);
      }
    });
  });
});
