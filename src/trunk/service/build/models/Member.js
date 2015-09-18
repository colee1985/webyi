var Error, Q, log4js, model, mongoose;

Q = require('q');

mongoose = require("../utils/mongoose");

log4js = require('log4js');

Error = require('../utils/Error');

model = new mongoose.Schema({
  nickname: {
    type: String,
    trim: true,
    required: true,
    intro: '昵称'
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    unique: true,
    "default": null,
    intro: '邮箱'
  },
  avatar: {
    type: String,
    "default": null,
    intro: '头像'
  },
  mobile: {
    type: String,
    trim: true,
    unique: true,
    "default": null,
    intro: '手机号'
  },
  password: {
    type: String,
    "default": null,
    intro: '密码'
  },
  token: {
    type: String,
    "default": null,
    intro: 'TOKEN'
  },
  token_expires_time: {
    type: Date,
    expires: 60 * 60 * 24 * 7,
    intro: 'TOKEN有效时长'
  },
  sex: {
    type: String,
    "default": 'unknown',
    "enum": ['unknown', 'man', 'woman'],
    intro: '性别'
  },
  birthday: {
    type: Date,
    "default": null,
    intro: '生日'
  },
  address: {
    type: String,
    "default": null,
    intro: '常用地址'
  },
  addresses: {
    type: [String],
    "default": [],
    intro: '常用地址集'
  },
  create_time: {
    type: Date,
    "default": Date.now,
    intro: '创建时间'
  },
  last_update_time: {
    type: Date,
    "default": Date.now,
    intro: '最后更新时间'
  },
  retrieve_code: {
    type: String,
    "default": null,
    intro: '找回密码要用的验证code'
  }
});

module.exports = mongoose.model('member', model);
