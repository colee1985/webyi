var Q, mongoose;

Q = require('q');

mongoose = require("../utils/mongoose");

module.exports = new mongoose.Schema({
  name: {
    type: String,
    "default": null,
    intro: ''
  },
  debug: {
    type: String,
    "default": null,
    intro: ''
  },
  server_port: {
    type: Number,
    "default": null,
    intro: ''
  },
  db_host: {
    type: String,
    "default": null,
    intro: ''
  },
  db_port: {
    type: Number,
    "default": 27017,
    intro: ''
  },
  db_name: {
    type: String,
    "default": null,
    intro: ''
  },
  db_username: {
    type: String,
    "default": null,
    intro: ''
  },
  db_password: {
    type: String,
    "default": null,
    intro: ''
  },
  create_time: {
    type: Date,
    "default": Date.now,
    intro: ''
  },
  creater_id: {
    type: mongoose.Schema.Types.ObjectId,
    "default": null,
    intro: ''
  },
  other_conf: {
    type: String,
    "default": null,
    intro: '其它配置'
  },
  directory: {
    type: String,
    "default": null,
    intro: '存放目录'
  }
});
