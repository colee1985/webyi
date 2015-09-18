var Q, mongoose;

Q = require('q');

mongoose = require("../utils/mongoose");

module.exports = new mongoose.Schema({
  name: {
    type: String,
    "default": null,
    intro: '文件名'
  },
  code: {
    type: String,
    "default": null,
    intro: '代码'
  },
  intro: {
    type: String,
    "default": null,
    intro: '简介'
  },
  creater_id: {
    type: mongoose.Schema.Types.ObjectId,
    "default": null,
    intro: ''
  },
  app_item_id: {
    type: mongoose.Schema.Types.ObjectId,
    "default": null,
    intro: ''
  },
  create_time: {
    type: Date,
    "default": new Date,
    intro: ''
  },
  code_type: {
    type: String,
    "enum": ["html", "javascript", "coffee", "css", "stylus"],
    "default": null,
    intro: '代码类型'
  },
  plan_status: {
    type: String,
    "default": null,
    intro: ''
  }
});
