var Error, Q, e, log4js, model, mongoose;

Q = require('q');

mongoose = require("../utils/mongoose");

log4js = require('log4js');

Error = require('../utils/Error');

model = new mongoose.Schema({
  name: String,
  intro: String,
  code: String,
  creater_id: {
    type: mongoose.Schema.Types.ObjectId,
    intro: '创建者ID'
  },
  app_item_id: {
    type: mongoose.Schema.Types.ObjectId,
    intro: '项目ID'
  }
});

try {
  mongoose.model('co_view', model);
} catch (_error) {
  e = _error;
}

module.exports = mongoose.model('co_view');
