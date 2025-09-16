const winston = require("winston")

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf , colorize, json} = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = winston.createLogger({
    format: combine(
        label({ label: 'eventservice' }),
        timestamp(),
        myFormat
      ),
    transports: [
        new transports.Console(),
        new transports.File({filename: "./log/error.log", level: "error"}),
        new transports.File({filename: "./log/combie.log", level: "info"})
    ]
})

logger.exitOnError = false

logger.exceptions.handle(
    new transports.File({filename: "./log/exceptions.log"})
)

logger.rejections.handle(
    new transports.File({filename: "./log/rejections.log"})
)

module.exports = logger