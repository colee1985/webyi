var Error, Q, log4js, model, mongoose, parame;

Q = require('q');

mongoose = require("../utils/mongoose");

log4js = require('log4js');

Error = require('../utils/Error');

parame = new mongoose.Schema({
  name: String,
  value: String,
  value_type: String,
  is_require: String,
  intro: String
});

model = new mongoose.Schema({
  title: String,
  path: String,
  type: String,
  intro: String,
  headers: [parame],
  gets: [parame],
  posts: [parame],
  code: String,
  test_code: String,
  creater_id: {
    type: mongoose.Schema.Types.ObjectId,
    intro: '创建者ID'
  },
  app_item_id: {
    type: mongoose.Schema.Types.ObjectId,
    intro: '项目ID'
  },
  plan_status: String
});

module.exports = mongoose.model('co_requrl', model);
