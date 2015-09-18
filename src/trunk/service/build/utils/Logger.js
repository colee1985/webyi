var log4js, logger, settings;

settings = require('../config');

log4js = require('log4js');

log4js.configure(settings.logs);

logger = log4js.getLogger('');

logger.setLevel(settings.logs.level);

module.exports = logger;
