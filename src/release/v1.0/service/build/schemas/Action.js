var Q, mongoose;

Q = require('q');

mongoose = require("../utils/mongoose");

module.exports = new mongoose.Schema({
  name: {
    type: String,
    "default": null,
    intro: ''
  },
  parames: {
    type: Array,
    "default": null,
    intro: '参数集'
  },
  intro: {
    type: String,
    "default": null,
    intro: '简介'
  },
  code: {
    type: String,
    "default": null,
    intro: '实现代码'
  },
  test_code: {
    type: String,
    "default": null,
    intro: '测试代码'
  },
  creater_id: {
    type: mongoose.Schema.Types.ObjectId,
    "default": null,
    intro: '创建者ID'
  },
  app_item_id: {
    type: mongoose.Schema.Types.ObjectId,
    "default": null,
    intro: '所属项目ID'
  },
  plan_status: {
    type: String,
    "default": null,
    intro: ''
  }
});
