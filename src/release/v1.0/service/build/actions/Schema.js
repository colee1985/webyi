var Error, Q, crypto, log4js, model;

Q = require('q');

crypto = require('crypto');

log4js = require('log4js');

Error = require('../utils/Error');

model = require('../models/Schema');

module.exports = (function() {
  return {
    save: function(data) {
      return Q.fcall(function() {
        if (data._id) {
          return model.findByIdAndUpdateQ(data._id, {
            $set: data
          });
        }
        return model.createQ(data);
      }).then(function(doc) {
        return doc;
      });
    },
    findById: function(_id) {
      return model.findByIdQ(_id).then(function(doc) {
        if (!doc) {
          throw new Error(300000);
        }
        return doc;
      });
    },
    del: function(_id) {
      return model.findByIdAndRemoveQ(_id);
    },
    getList: function(app_item_id, creater_id) {
      return model.findQ({
        creater_id: creater_id,
        app_item_id: app_item_id
      }).then(function(docs) {
        return docs;
      });
    }
  };
})();