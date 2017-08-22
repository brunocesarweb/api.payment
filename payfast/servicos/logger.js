var winston = require('winston');
var fs = require("fs");

if (!fs.existsSync('logs')) {
  fs.mkdirSync('logs');
}

module.exports = new winston.Logger({
  transports: [
    new winston.transports.File({
      level: "info",
      filename: "logs/payfast.log",
      maxsize: 100000,
      maxFiles: 10,
      colorize: false
    })
  ]
});

// logger.log('Log utilizando o winston');
// logger.log('info','Log utilizando winston e info');
// logger.info('Log mais maroto');
